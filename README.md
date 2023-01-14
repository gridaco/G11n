![](./branding/g11n-cover-shaed.png)

# G11n

G11n, i18n, l10n support for Grida's internal system and as supporting other products of their own on Grida ecosystem

## Running on your localhost

```
git clone https://github.com/gridaco/g11n
cd g11n # or cd G11n
yarn
yarn editor
# visit test scene. -> http://localhost:3306/globalization/scenes/Yi5VNbb24sTMLHdgCBUVc
```

## Games Globalization with Unity

- Demo : visit https://globalization-editor-mz.bridged.xyz/globalization/demo/games for demos or http://localhost:3306/globalization/demo/games on local.
- Unity G11n SDK - [directory](./sdks/unity)

## Installation

```
yarn add @grida.co/g11n
```

## Project

**Main**

- [g11n](./g11n) (npm) - g11n core package
- [editor](./editor) ([web](https://globalization-editor-mz.bridged.xyz/)) - g11n editor
- [homepage](./homepage) ([web](https://globalization-homepage-mz.bridged.xyz/)) - g11n homepage
- [packages](./packages) - general shared packages
- [services](./services) - backend

**Sub modules**

- [gridaco/figma-view](https://github.com/gridaco/figma-view) - for rendering preview of translated designs in realtime
- [gridaco/code](https://github.com/gridaco/code) - for converting raw design files to executable code, using figma-view

**UI**

- [reflect-ui/editor-ui](https://github.com/reflect-ui/editor-ui) - A UI Library for editor apps used by Grida platform

## Integrations

**G11n for storybook**

- g11n as storybook addon for previewing localized texts / assets on components.


## References
- [towardsdatascience.com/translate-with-gpt-3](https://towardsdatascience.com/translate-with-gpt-3-9903c4a6f385)
