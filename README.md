# manifest-loader
A webpack loader to generate dynamic asset manifests for static assets (images, sounds, videos) for passing into a preloading system 

#config

Define a block in your webpack config that specifies the following options, give it a meaningful key

```
    var webpackConfig = {
        entry: {
            client: [jsSrc + "client.js"]
        },
        images: {
            assetsPath: __dirname + '/../../app/assets/images',
            rewritePath: "assets/images/",
            ignore: ['.DS_Store']
        },
     }
```

## assetsPath
The absolute path to your static asstets

## rewritePath (optional)
Optionally rewrite the path to make it relative (import for a runtime asset loader like preloadJS)

## ignore
A blob of matching files to ignore

#usage

First define a json file that you want to serve as your dynamic manifest- e.g. asset_manifest.json

```
[]
```

then require that file wherever you need to dynamically load assets (this examples is using preloadJS)-

```
import assetManifest from "json!manifest-loader?config=images/!../meta/asset_manifest.json"

export default class AssetLoader {
    static load( progress ) {
        return new Promise(( resolve, reject )=> {
            assetManifest(( files )=> {
                const preload = new createjs.LoadQueue();
                preload.addEventListener("complete", ()=> {
                    resolve();
                });
                preload.addEventListener("progress", ( event )=> {
                    progress(event);
                });
                //load each file into the manifest
                preload.loadManifest(files.map(f=> {
                    return {id: f, src: f}
                }));
            });
        })
    }
}
```

