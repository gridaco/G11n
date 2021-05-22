import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * the root api getter, check if function is running properly. used for pulse checking.
   */
  @Get('/')
  async getHello() {
    return 'service is running';
  }

  /**
   * register new key. initial assets are optional
   * @param request
   */
  @Post('/keys')
  async postRegisterKey(@Body() request) {
    return await this.appService.registerNewKey(request);
  }

  /**
   * deletes the key with givven path id
   * @param p
   */
  @Delete('/keys/:id')
  async deleteKey(@Param() p) {
    const id = p.id;
    return await this.appService.fetchKey(id);
  }

  /**
   * fetches the key with givven parameter id
   * @param p
   */
  @Get('/keys/:id')
  async getKey(@Param() p) {
    const id = p.id;
    return await this.appService.deleteKey(id);
  }

  /**
   * updates the key's key name with givven parameter id, and the request body's `keyName` property
   * @param p
   * @param request
   */
  @Patch('/keys/:id/name')
  async patchUpdateKeyName(@Param() p, @Body() request) {
    const id = p.id;
    const keyName = request.keyName;
    return await this.appService.udateKeyName(id, keyName);
  }

  /**
   * bulk get translations with query parameter
   * @param p
   */
  @Get('/translations')
  async getTranslations(@Query() q) {
    throw 'not implemented';
  }

  /**
   * get single translation.
   * id is a id of key, wich indicates to the translation map (variant asset)
   * @param p
   */
  @Get('/translations/:id')
  async getTranslation(@Param() p: { id: string }) {
    const id = p.id;
    return await this.appService.fetchTranslation(id);
  }

  /**
   * adds a new translation. if already exists, throws 409 conflict
   * id is a id of key, wich indicates to the translation map (variant asset)
   * @param p
   */
  @HttpCode(200)
  @HttpCode(409)
  @HttpCode(400)
  @Post('/translations/:id/locales/:locale')
  async addTranslation(
    @Param() p: TranslationAccessorParams,
    @Body() body: PutTranslationRequestBody
  ) {
    return this.appService.addTranslation({
      keyId: p.id,
      locale: p.locale,
      value: body.value,
    });
  }

  /**
   * puts translation with key id, and locale
   * @param p
   * @param body
   */
  @HttpCode(200)
  @HttpCode(400)
  @Put('/translations/:id/locales/:locale')
  async putTranslation(
    @Param() p: TranslationAccessorParams,
    @Body() body: PutTranslationRequestBody
  ) {
    // put raw asset to with target locale
    return this.appService.putTranslation({
      keyId: p.id,
      locale: p.locale,
      value: body.value,
    });
  }

  /**
   *  updates translation with key id, and locale. if no locale was added previously, throws 404
   * @param p
   * @param request
   */
  @HttpCode(200)
  @HttpCode(404)
  @HttpCode(400)
  @Patch('/translations/:id/locales/:locale')
  async updateTranslation(
    @Param() p: TranslationAccessorParams,
    @Body() body: PutTranslationRequestBody
  ) {
    return this.appService.updateTranslation({
      keyId: p.id,
      locale: p.locale,
      value: body.value,
    });
  }

  //
  // ==========================================
  //

  @Get('/scenes/:scene')
  async getSceneTranslations(@Param() p: { scene: string }) {
    console.log('starting [GET] getSceneTranslations');
    return await this.appService.fetchSceneTranslations(p.scene);
  }

  @Get('/scenes/:scene/layers/:layer')
  async getLayerTranslation(@Param() p: LayerKeyMapAccessorParams) {
    return await this.appService.fetchLayerTranslation({
      sceneId: p.scene,
      layerId: p.layer,
    });
  }

  @Put('/scenes/:scene/layers/:layer')
  async putLayerKeyMap(
    @Param() p: LayerKeyMapAccessorParams,
    @Body()
    body: {
      keyId: string;
    }
  ) {
    return await this.appService.putLayerKeyMap({
      keyId: body.keyId,
      sceneId: p.scene,
      layerId: p.layer,
    });
  }

  //
  // ==========================================
  //
}

interface TranslationAccessorParams {
  id: string;
  locale: string;
}

interface PutTranslationRequestBody {
  value: string;
}

interface LayerKeyMapAccessorParams {
  scene: string;
  layer: string;
}
