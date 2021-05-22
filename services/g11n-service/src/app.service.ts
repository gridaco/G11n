import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as dynamoose from 'dynamoose';

import {
  GlobalizedKeyRegisterRequest,
  TextTranslationAddRequest,
  TextTranslationPutRequest,
  TextTranslationUpdateRequest,
} from '@bridged.xyz/client-sdk/lib/g11n/api';
import {
  registerVariantAsset,
  getVariantAsset,
  addAvariant,
  putVariant,
  updateVariant,
} from '@bridged.xyz/client-sdk/lib/assets/api';
import {
  IGlobalizedKey,
  LayerTranslation,
} from '@bridged.xyz/client-sdk/lib/g11n';
import {
  KeyModel,
  KeyRecord,
  LayerKeyMapModel,
  LayerKeyMapRecord,
} from './app.entity';

const projectId = 'temp';

@Injectable()
export class AppService {
  async registerNewKey(request: GlobalizedKeyRegisterRequest) {
    console.log('registerNewKey with request', request);
    /**
     * create the variant asset to be linked with this key first.
     */
    let reservedLinkedAsset;
    try {
      reservedLinkedAsset = await registerVariantAsset(projectId, {
        type: request.assetType,
        initialAssets: request.initialTranslations,
      });
    } catch (_) {
      console.log('error', _);
      throw _;
    }

    const id = nanoid();
    const input = new KeyModel({
      id: id,
      projectId: projectId,
      keyName: request.keyName,
      type: request.assetType,
      linkedAssetId: reservedLinkedAsset.id,
      embeddable: request.embeddable ? request.embeddable : false,
    });

    const newKeyRecord = await input.save();
    console.log('new key created', newKeyRecord);

    return await this.fetchTranslation(id);
  }

  async deleteKey(id: string) {
    return await KeyModel.delete(id);
  }

  async fetchKey(id: string) {
    return await KeyModel.get(id);
  }

  async udateKeyName(id: string, name: string) {
    const updatedRecrod = await KeyModel.update(
      { id: id },
      {
        keyName: name,
      }
    );
    console.log('key name updated.', updatedRecrod);
    return await this.fetchTranslation(id);
  }

  async addTranslation(request: TextTranslationAddRequest) {
    // get key's linked asset
    const key = ((await KeyModel.get(request.keyId)) as any) as KeyRecord;

    // add as variant on asset service
    await addAvariant(projectId, {
      variantAssetId: key.linkedAssetId,
      variant: request.locale,
      asset: {
        value: request.value,
      },
    });
    return await this.fetchTranslation(request.keyId);

    throw new HttpException('translation already exists', HttpStatus.CONFLICT);
  }

  /**
   * updates tranlation's text value
   */
  async updateTranslation(request: TextTranslationUpdateRequest) {
    // get key's linked asset
    const key = ((await KeyModel.get(request.keyId)) as any) as KeyRecord;

    // add as variant on asset service
    await updateVariant(projectId, {
      variantAssetId: key.linkedAssetId,
      variant: request.locale,
      asset: {
        value: request.value,
      },
    });
    return await this.fetchTranslation(request.keyId);
  }

  async putTranslation(request: TextTranslationPutRequest) {
    // get key's linked asset
    const key = ((await KeyModel.get(request.keyId)) as any) as KeyRecord;

    // add as variant on asset service
    await putVariant(projectId, {
      variantAssetId: key.linkedAssetId,
      variant: request.locale,
      asset: {
        value: request.value,
      },
    });
    return await this.fetchTranslation(request.keyId);
  }

  async fetchTranslation(id: string): Promise<IGlobalizedKey> {
    console.log('fetching translations with key ', id);
    const key = ((await KeyModel.get(id)) as any) as KeyRecord;

    if (!key) {
      throw new HttpException(`key not found with id ${id}`, 404);
    }

    const linkedAssetId = key.linkedAssetId;
    const linkedAsset = await getVariantAsset(projectId, linkedAssetId);

    return {
      id: key.id,
      key: key.keyName,
      translations: linkedAsset.assets,
    };
  }

  /**
   * removes translation from key, removes linked asset to it if the asset is only linked to this key.
   * all related keys' assets key reference will be replaced with last cached value
   */
  async removeTranslation() {
    throw 'not implemented';
  }

  async fetchSceneTranslations(
    sceneId: string
  ): Promise<ReadonlyArray<LayerTranslation>> {
    const keyMaps = await this.findKeyMapsFromDesign({
      sceneId: sceneId,
    });
    console.log('fetchSceneTranslations : keyMaps', keyMaps);

    if (keyMaps) {
      const layerTranslations: Array<LayerTranslation> = [];
      for (let i = 0; i < keyMaps.length; i++) {
        const el = keyMaps[i];
        const keyId = el.keyId;
        const translation = await this.fetchTranslation(keyId);
        const layerTranslation = <LayerTranslation>{
          ...el,
          translation: translation,
        };
        layerTranslations.push(layerTranslation);
      }
      return layerTranslations;
    } else {
      return [];
    }
  }

  async fetchLayerTranslation(request: { sceneId: string; layerId: string }) {
    const keyMaps = await this.findKeyMapsFromDesign(request);
    console.log('fetchLayerTranslation : keyMaps', keyMaps);

    if (keyMaps) {
      if (keyMaps.length > 1) {
        throw 'invalid number of keys for single layer. unique layer can only hold single key';
      }

      const keyMap = keyMaps[0];
      const keyId = keyMap.keyId;
      console.log('keyId', keyId);
      const translation = await this.fetchTranslation(keyId);

      return <LayerTranslation>{
        sceneId: request.sceneId,
        layerId: request.layerId,
        keyId: keyId,
        projectId: projectId,
        translation: translation,
      };
    } else {
      throw new HttpException('translation not found', 404);
    }
  }

  async putLayerKeyMap(request: {
    keyId: string;
    sceneId: string;
    layerId: string;
  }) {
    const record = await this.findKeyForLayer(request);

    let id: string;
    if (record) {
      id = record.id;
    } else {
      id = nanoid();
    }

    const updated = await LayerKeyMapModel.update({
      id: id,
      keyId: request.keyId,
      projectId: projectId,
      sceneId: request.sceneId,
      layerId: request.layerId,
    });

    console.log('updated', updated);
    return updated;
  }

  private async findKeyForLayer(q: {
    projectId?: string;
    keyId?: string;
    sceneId?: string;
    layerId?: string;
  }): Promise<LayerKeyMapRecord | undefined> {
    const condition = new dynamoose.Condition();
    if (q.projectId) {
      condition
        .where('projectId')
        .eq(projectId)
        .and();
    }
    if (q.sceneId) {
      condition
        .where('sceneId')
        .eq(q.sceneId)
        .and();
    }
    if (q.layerId) {
      condition.where('layerId').eq(q.layerId);
    }

    const scaned = await LayerKeyMapModel.scan(condition).exec();
    if (scaned.length > 1) {
      throw 'invalid operation scanned document must be single or empty';
    }

    const exists = scaned.length == 1;
    if (exists) {
      return (scaned[0] as any) as LayerKeyMapRecord;
    } else {
      undefined;
    }
  }

  private async findKeyMapsFromDesign(q: {
    projectId?: string;
    keyId?: string;
    sceneId?: string;
    layerId?: string;
  }): Promise<ReadonlyArray<LayerKeyMapRecord> | undefined> {
    const condition = new dynamoose.Condition();
    if (q.projectId) {
      condition
        .where('projectId')
        .eq(projectId)
        .and();
    }
    if (q.sceneId) {
      condition
        .where('sceneId')
        .eq(q.sceneId)
        .and();
    }
    if (q.layerId) {
      condition.where('layerId').eq(q.layerId);
    }

    const scaned = await LayerKeyMapModel.scan(condition).exec();
    console.log('findKeyMapsFromDesign : scaned', scaned);
    const exists = scaned.length >= 1;
    if (exists) {
      return (scaned as any) as ReadonlyArray<LayerKeyMapRecord>;
    } else {
      undefined;
    }
  }
}
