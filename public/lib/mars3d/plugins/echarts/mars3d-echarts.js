/**
 * Mars3D平台插件,结合echarts可视化功能插件  mars3d-echarts
 *
 * 版本信息：v3.7.23
 * 编译日期：2024-07-22 00:04:51
 * 版权所有：Copyright by 火星科技  http://mars3d.cn
 * 使用单位：免费公开版 ，2024-01-15
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, (window.echarts || require('echarts')), (window.mars3d || require('mars3d'))) :
  typeof define === 'function' && define.amd ? define(['exports', 'echarts', 'mars3d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mars3d-echarts"] = {}, global.echarts, global.mars3d));
})(this, (function (exports, echarts, mars3d) { 
'use strict';(function(_0x2a18d6,_0xe54a73){const _0x2c6d75={_0x2a3db5:0xce,_0x1d134e:0x17b,_0x4b066e:0x164,_0x2a86cd:0x168,_0x252140:0x14a,_0x1849c3:0x12c,_0x28375c:0x82,_0x224e05:0xa2,_0x56f33a:0xcf},_0x203531={_0x510a43:0x57};function _0x187f31(_0x5c9d01,_0x3a2ca4){return _0x162c(_0x3a2ca4-_0x203531._0x510a43,_0x5c9d01);}function _0x5f0fe6(_0x1fc2e0,_0x1997dc){return _0x162c(_0x1997dc- -0x1a5,_0x1fc2e0);}const _0x43625e=_0x2a18d6();while(!![]){try{const _0x36a498=parseInt(_0x5f0fe6(-0xe8,-0xd5))/0x1+parseInt(_0x187f31(0x15a,0x144))/0x2+-parseInt(_0x5f0fe6(-_0x2c6d75._0x2a3db5,-0xa4))/0x3*(-parseInt(_0x187f31(_0x2c6d75._0x1d134e,_0x2c6d75._0x4b066e))/0x4)+parseInt(_0x5f0fe6(-0xad,-0xd8))/0x5*(parseInt(_0x187f31(0x154,_0x2c6d75._0x2a86cd))/0x6)+-parseInt(_0x187f31(_0x2c6d75._0x252140,_0x2c6d75._0x1849c3))/0x7+parseInt(_0x5f0fe6(-_0x2c6d75._0x28375c,-_0x2c6d75._0x224e05))/0x8*(parseInt(_0x5f0fe6(-0xe4,-_0x2c6d75._0x56f33a))/0x9)+parseInt(_0x5f0fe6(-0xce,-0xc9))/0xa*(-parseInt(_0x187f31(0x15a,0x153))/0xb);if(_0x36a498===_0xe54a73)break;else _0x43625e['push'](_0x43625e['shift']());}catch(_0x393c6c){_0x43625e['push'](_0x43625e['shift']());}}}(_0x1a3a,0x2bc33));function _interopNamespace(_0x54f955){const _0x924285={_0x3a39bb:0x1a8,_0x9fbb19:0x1f4},_0x4084bb={_0x222bef:0x2a9};if(_0x54f955&&_0x54f955[_0x38f428(-0xe9,-0x102)])return _0x54f955;var _0x1fafc3=Object['create'](null);function _0x38f428(_0x5ca886,_0xedd279){return _0x162c(_0xedd279- -0x21d,_0x5ca886);}function _0x4f31ce(_0x9c129d,_0x190f4e){return _0x162c(_0x190f4e- -_0x4084bb._0x222bef,_0x9c129d);}return _0x54f955&&Object['keys'](_0x54f955)[_0x4f31ce(-0x1b4,-0x19d)](function(_0x2ff73f){function _0x2417eb(_0x250ba9,_0x23f820){return _0x4f31ce(_0x23f820,_0x250ba9-0x15d);}function _0x165c1f(_0x570a2f,_0x45aff1){return _0x4f31ce(_0x45aff1,_0x570a2f-0x388);}if(_0x2ff73f!=='default'){var _0xef70cd=Object[_0x165c1f(0x1a8,_0x924285._0x3a39bb)](_0x54f955,_0x2ff73f);Object[_0x165c1f(0x1e6,_0x924285._0x9fbb19)](_0x1fafc3,_0x2ff73f,_0xef70cd['get']?_0xef70cd:{'enumerable':!![],'get':function(){return _0x54f955[_0x2ff73f];}});}}),_0x1fafc3[_0x38f428(-0x12a,-0x105)]=_0x54f955,_0x1fafc3;}var echarts__namespace=_interopNamespace(echarts),mars3d__namespace=_interopNamespace(mars3d);const Cesium$1=mars3d__namespace['Cesium'];function _0x24595c(_0x535a68,_0x4cd40a){const _0x834576={_0x43351a:0x3af};return _0x162c(_0x4cd40a- -_0x834576._0x43351a,_0x535a68);}function _0x162c(_0x8d643b,_0x4ce7e5){const _0x1a3af9=_0x1a3a();return _0x162c=function(_0x162c65,_0xcee1a3){_0x162c65=_0x162c65-0xc6;let _0x59db9f=_0x1a3af9[_0x162c65];if(_0x162c['fxBgRF']===undefined){var _0x49a068=function(_0x522860){const _0x4cc7b2='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x15c66b='',_0x3c1ccd='';for(let _0x5c3a0d=0x0,_0x4857b1,_0x105462,_0x54f955=0x0;_0x105462=_0x522860['charAt'](_0x54f955++);~_0x105462&&(_0x4857b1=_0x5c3a0d%0x4?_0x4857b1*0x40+_0x105462:_0x105462,_0x5c3a0d++%0x4)?_0x15c66b+=String['fromCharCode'](0xff&_0x4857b1>>(-0x2*_0x5c3a0d&0x6)):0x0){_0x105462=_0x4cc7b2['indexOf'](_0x105462);}for(let _0x1fafc3=0x0,_0x2ff73f=_0x15c66b['length'];_0x1fafc3<_0x2ff73f;_0x1fafc3++){_0x3c1ccd+='%'+('00'+_0x15c66b['charCodeAt'](_0x1fafc3)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3c1ccd);};_0x162c['TGfbsk']=_0x49a068,_0x8d643b=arguments,_0x162c['fxBgRF']=!![];}const _0x2236cf=_0x1a3af9[0x0],_0x3a7c02=_0x162c65+_0x2236cf,_0x28ecfd=_0x8d643b[_0x3a7c02];return!_0x28ecfd?(_0x59db9f=_0x162c['TGfbsk'](_0x59db9f),_0x8d643b[_0x3a7c02]=_0x59db9f):_0x59db9f=_0x28ecfd,_0x59db9f;},_0x162c(_0x8d643b,_0x4ce7e5);}function _0x1a3a(){const _0x481e87=['z2v0qxr0CLzHBa','zwnjBNn0yw5Jzq','z2v0uM9HBvrYyw5ZzM9YBq','zwXSAxbZB2LK','qM91BMrPBMDszwn0','Eg1HEa','C2nLBMu','CM9HBq','mtfMtMfiEwW','x3bVAw50zxjfDMvUDhm','B25cEvf1zxj5','zwfJAfnLCMLLCW','y2XPzw50sgvPz2H0','mtu2qMLYq21l','CMvNAxn0zxjby3rPB24','oezjDvzpDG','C3r5Bgu','zxzLBNrqyxjLBNq','ywjZB2X1Dgu','zgvMAw5LuhjVCgvYDhK','y29VCMrPBMf0zvn5C3rLBq','x2fWAq','y2XPzw50v2LKDgG','yxbP','zM9YrwfJAa','mJu0ntjrBKnIqMW','zwnOyxj0C0rLChrOvgvZDa','D2LKDgG','BwLU','nM9PB09stW','D29YBgruB1DPBMrVD0nVB3jKAw5HDgvZ','DxbKyxrLtgf5B3v0','x21HCa','EKLUzgv4','B3b0Aw9UCW','z2XVyMu','zgvMyxvSDa','uMvJDgfUz2XL','B2zM','x19LC01VzhvSzq','z2v0uMvJDgfUz2XL','y3jLyxrL','q2fYDgvZAwfUmW','CMvNAxn0zxi','z2v0t3DUuhjVCgvYDhLezxnJCMLWDg9Y','y2fUDMfZ','x2nYzwf0zunOyxj0t3zLCMXHEq','B25SEvnPBxbSzvr5Cgu','mtm4odK5mfncsvzwyq','x21HCe9MzNnLDa','BM9Uzq','mtu2mti1D2Tsswno','z2v0qK1HCa','C2v0rwnOyxj0C09WDgLVBG','zxzLBNq','u0nftKuZra','otGXmteZDuj0qMDf','mJa2ntK5nxbyEujPDq','y29UDgfPBMvY','zwnOyxj0CW','ywrKrxzLBNrmAxn0zw5LCG','DhLWzq','Cg9PBNrLCKv2zw50CW','otC5mtq0meH6yufVyG','zxH0zw5Kq29TCg9Uzw50tw9KzwW','C2v0t3b0Aw9U','zNjVBurLz3jLzxm','Cg9ZDfjLBMrLCG','BwfYCZnKlwvJAgfYDhm','zwfJAenVBxbVBMvUDa','BwfYCZnKtwfW','x2vJAgfYDhnjBNn0yw5Jzq','C2v0twfWt2zMC2v0','Cg9ZAxrPB25xqW','DMfSDwu','x2vJAgfYDhndB250ywLUzxi','Bw92zuHHBMrSzxi','z2v0','zgLTzw5ZAw9UCW','mhb4','nJa4ndaWr2rotLD2','rwnOyxj0C0XHEwvY','zwnOyxj0C0zPEgvKsgvPz2H0','AgLKzgvU','y2fTzxjH','y2XLyxi','x21HCNmZzf9Zy2vUzq'];_0x1a3a=function(){return _0x481e87;};return _0x1a3a();}class CompositeCoordinateSystem{constructor(_0x3184df,_0xd0ee7c){const _0x1d54a1={_0x316749:0x1df,_0x5882ce:0x1c4};this[_0x9f459e(-0x2c,-0x14)]=_0x3184df;function _0x9f459e(_0x325cb3,_0x1605d2){return _0x162c(_0x1605d2- -0x107,_0x325cb3);}function _0x3146f3(_0xbbdfe9,_0x51f646){return _0x162c(_0x51f646- -0x2cd,_0xbbdfe9);}this[_0x9f459e(-0x37,-0x1c)]=['lng','lat'],this['_mapOffset']=[0x0,0x0],this[_0x3146f3(-_0x1d54a1._0x316749,-_0x1d54a1._0x5882ce)]=_0xd0ee7c;}[_0x14f71c(0x45d,0x485)](_0x1fd381){this['_mapOffset']=_0x1fd381;}[_0x14f71c(0x449,0x427)](){return this['_mars3d_scene'];}['dataToPoint'](_0x4925be){const _0x14b0a5={_0x58af54:0x102,_0x20569a:0x486,_0x551da2:0xed},_0x287387=this['_mars3d_scene'];function _0x2e538b(_0x5393a2,_0x2f7836){return _0x14f71c(_0x2f7836-0x19,_0x5393a2);}const _0x509ff1=[NaN,NaN];let _0x4e81d4=_0x287387['echartsFixedHeight'];_0x287387['echartsAutoHeight']&&(_0x4e81d4=_0x287387['getHeight'](Cesium$1['Cartographic'][_0x3a14c9(0xf6,0xf8)](_0x4925be[0x0],_0x4925be[0x1])));const _0x1b4e0b=Cesium$1[_0x3a14c9(_0x14b0a5._0x58af54,0xe0)]['fromDegrees'](_0x4925be[0x0],_0x4925be[0x1],_0x4e81d4);if(!_0x1b4e0b)return _0x509ff1;const _0x40e8a7=Cesium$1['SceneTransforms'][_0x2e538b(0x4a3,0x4a3)](_0x287387,_0x1b4e0b);if(!_0x40e8a7)return _0x509ff1;if(_0x287387[_0x2e538b(_0x14b0a5._0x20569a,0x49f)]&&_0x287387['mode']===Cesium$1['SceneMode'][_0x3a14c9(0xd9,_0x14b0a5._0x551da2)]){const _0x11fe90=new Cesium$1['EllipsoidalOccluder'](_0x287387[_0x3a14c9(0x12f,0x130)][_0x2e538b(0x461,0x488)],_0x287387[_0x2e538b(0x459,0x482)][_0x2e538b(0x49a,0x477)]),_0x1f8b12=_0x11fe90['isPointVisible'](_0x1b4e0b);if(!_0x1f8b12)return _0x509ff1;}function _0x3a14c9(_0x30b889,_0x17d290){return _0x14f71c(_0x17d290- -0x35f,_0x30b889);}return[_0x40e8a7['x']-this['_mapOffset'][0x0],_0x40e8a7['y']-this[_0x2e538b(0x455,0x45f)][0x1]];}['getViewRect'](){const _0x53c7eb={_0x1445e4:0x60},_0x2cfcd3=this[_0x1de517(-0x2b1,-0x2b3)];function _0x1de517(_0x440b65,_0x1773c4){return _0x14f71c(_0x440b65- -0x732,_0x1773c4);}function _0x1c48ba(_0x1a362b,_0x5238eb){return _0x14f71c(_0x5238eb- -0x4f3,_0x1a362b);}return new echarts__namespace['graphic'][(_0x1c48ba(-_0x53c7eb._0x1445e4,-0x83))](0x0,0x0,_0x2cfcd3['getWidth'](),_0x2cfcd3['getHeight']());}[_0x14f71c(0x46e,0x482)](){return echarts__namespace['matrix']['create']();}}CompositeCoordinateSystem['dimensions']=['lng','lat'],CompositeCoordinateSystem['create']=function(_0x159e21,_0x4778ea){const _0x4e63dd={_0x358f37:0xc,_0x65ad4a:0x8},_0x100107={_0x3c2229:0xdd},_0x482aac={_0x134c24:0x3dc},_0xd6b502={_0x203633:0x285},_0x1980ac={_0x5d7667:0x33e};function _0x57e555(_0x37c0d3,_0x1714da){return _0x14f71c(_0x1714da- -0x43f,_0x37c0d3);}let _0x3ab05d;const _0x313439=_0x159e21['scheduler']['ecInstance'][_0x57e555(_0x4e63dd._0x358f37,0x2c)];_0x159e21[_0x57e555(-_0x4e63dd._0x65ad4a,0x1b)]('mars3dMap',function(_0x41eddf){const _0x38fa03={_0x1cfa34:0x2fd},_0x4b1461=_0x4778ea['getZr']()['painter'];function _0x770084(_0x11e68b,_0x304b5a){return _0x57e555(_0x11e68b,_0x304b5a-_0x38fa03._0x1cfa34);}if(!_0x4b1461)return;!_0x3ab05d&&(_0x3ab05d=new CompositeCoordinateSystem(_0x313439,_0x4778ea)),_0x41eddf[_0x770084(0x34c,_0x1980ac._0x5d7667)]=_0x3ab05d,_0x3ab05d['setMapOffset'](_0x41eddf['__mapOffset']||[0x0,0x0]);});function _0x5596ad(_0x591f9d,_0x5af92e){return _0x14f71c(_0x591f9d- -_0xd6b502._0x203633,_0x5af92e);}_0x159e21[_0x5596ad(0x1f2,0x1da)](function(_0x582048){const _0x138ab7={_0x2e397d:0xc1};function _0x4c2d58(_0x46d074,_0x132448){return _0x57e555(_0x132448,_0x46d074-_0x138ab7._0x2e397d);}function _0x191809(_0x40a71e,_0x49fe35){return _0x57e555(_0x49fe35,_0x40a71e-_0x482aac._0x134c24);}_0x582048[_0x4c2d58(0xe4,0x106)]('coordinateSystem')===_0x4c2d58(_0x100107._0x3c2229,0xeb)&&(!_0x3ab05d&&(_0x3ab05d=new CompositeCoordinateSystem(_0x313439,_0x4778ea)),_0x582048['coordinateSystem']=_0x3ab05d);});};function _0x14f71c(_0x362ecd,_0x4426d6){const _0x1c915e={_0x358d93:0x378};return _0x162c(_0x362ecd-_0x1c915e._0x358d93,_0x4426d6);}if(echarts__namespace!==null&&echarts__namespace!==void 0x0&&echarts__namespace['init']){echarts__namespace['registerCoordinateSystem']('mars3dMap',CompositeCoordinateSystem);const _0x522860={};_0x522860['type']='mars3dMapRoam',_0x522860[_0x14f71c(0x44b,0x44f)]='mars3dMapRoam',_0x522860['update']=_0x14f71c(0x48b,0x49d),echarts__namespace[_0x24595c(-0x298,-0x2ad)](_0x522860,function(_0x2c4165,_0x559f7b){});const _0x4cc7b2={};_0x4cc7b2[_0x24595c(-0x2b9,-0x2b4)]=![];const _0x15c66b={};_0x15c66b[_0x24595c(-0x2e7,-0x2d5)]='mars3dMap',_0x15c66b['getBMap']=function(){return this['_mars3d_scene'];},_0x15c66b['defaultOption']=_0x4cc7b2,echarts__namespace[_0x24595c(-0x2b4,-0x2d2)](_0x15c66b),echarts__namespace['extendComponentView']({'type':'mars3dMap','init':function(_0x3c95f8,_0x3432ba){const _0x1c1e53={_0xe332d4:0xc9,_0x20e913:0xb6},_0x2c7ef1={_0x1e3b74:0x2cd};function _0x3b5875(_0xd84885,_0x286f59){return _0x14f71c(_0x286f59- -_0x2c7ef1._0x1e3b74,_0xd84885);}this[_0x3b5875(0x1aa,0x1b6)]=_0x3432ba;function _0x33af65(_0x56aee2,_0x5a7f1a){return _0x24595c(_0x5a7f1a,_0x56aee2-0x385);}this[_0x3b5875(0x18a,0x1a5)]=_0x3c95f8['scheduler'][_0x3b5875(0x199,0x1a0)][_0x33af65(_0x1c1e53._0xe332d4,0xc3)],this[_0x3b5875(0x197,0x1a5)][_0x33af65(_0x1c1e53._0x20e913,0x9b)][_0x3b5875(0x180,0x184)](this['moveHandler'],this);},'moveHandler':function(_0x5a249c,_0x1947f9){const _0x4ceac2={_0x489e5b:0x664},_0x3546b7={};function _0x35b5d8(_0xb54bd5,_0x2a0625){return _0x14f71c(_0xb54bd5- -_0x4ceac2._0x489e5b,_0x2a0625);}_0x3546b7[_0x35b5d8(-0x212,-0x227)]='mars3dMapRoam',this['api']['dispatchAction'](_0x3546b7);},'render':function(_0x9f6cda,_0x1e0b4f,_0x54117a){},'dispose':function(_0x18af65){const _0x4d0ea1={_0x306647:0x299,_0x43d1b6:0x2bd},_0x59e3b2={_0x4624d7:0x35a};function _0x19b640(_0x228904,_0x305c59){return _0x24595c(_0x228904,_0x305c59-_0x59e3b2._0x4624d7);}function _0x236d4c(_0x2f08ca,_0x54465b){return _0x14f71c(_0x2f08ca- -0x1a4,_0x54465b);}this['scene'][_0x236d4c(0x2b4,_0x4d0ea1._0x306647)]['removeEventListener'](this[_0x236d4c(_0x4d0ea1._0x43d1b6,0x2c1)],this);}});}else throw new Error('请引入\x20echarts\x20库\x20');const Cesium=mars3d__namespace['Cesium'],BaseLayer=mars3d__namespace['layer']['BaseLayer'];class EchartsLayer extends BaseLayer{constructor(_0x1ed123={}){const _0x47f333={_0x30a968:0x4da,_0x4241be:0x4f3},_0x528c63={_0x5dd499:0x65};function _0x531f57(_0x4b809,_0x3e9d42){return _0x14f71c(_0x4b809-_0x528c63._0x5dd499,_0x3e9d42);}super(_0x1ed123);function _0x425cfe(_0x5f1a72,_0x582809){return _0x14f71c(_0x582809- -0x6b3,_0x5f1a72);}this[_0x531f57(_0x47f333._0x30a968,0x4bf)]=this[_0x531f57(_0x47f333._0x4241be,0x4fe)]['pointerEvents'];}get['layer'](){const _0x561dcc={_0x2a0a25:0x47};function _0x136dcb(_0x5683bf,_0x448cc4){return _0x24595c(_0x5683bf,_0x448cc4-0x2ea);}return this[_0x136dcb(_0x561dcc._0x2a0a25,0x1f)];}get['pointerEvents'](){return this['_pointerEvents'];}set[_0x24595c(-0x2d9,-0x2d4)](_0x27ac96){const _0x228d9c={_0x877400:0x2ee},_0x7f72c7={_0x3681ef:0x179};function _0x176179(_0x2fed5,_0x34ce8a){return _0x24595c(_0x34ce8a,_0x2fed5-0xf9);}function _0x261637(_0x8380cd,_0x5aa6ee){return _0x14f71c(_0x8380cd- -_0x7f72c7._0x3681ef,_0x5aa6ee);}this['_pointerEvents']=_0x27ac96,this['_echartsContainer']&&(_0x27ac96?this[_0x261637(0x2e7,_0x228d9c._0x877400)]['style']['pointerEvents']='all':this['_echartsContainer'][_0x176179(-0x1b2,-0x19c)]['pointerEvents']='none');}['_setOptionsHook'](_0x4cb390,_0x314612){this['setEchartsOption'](_0x4cb390);}['_showHook'](_0x4bc236){const _0x1d18a5={_0x42088c:0x23d},_0x582a35={_0x2a06bd:0x426},_0x24dd8b={_0x2bdc63:0x4e8};function _0x5666b8(_0x23e56c,_0xbe8dc6){return _0x24595c(_0xbe8dc6,_0x23e56c-_0x24dd8b._0x2bdc63);}function _0x126628(_0x42117e,_0x41902a){return _0x24595c(_0x41902a,_0x42117e-_0x582a35._0x2a06bd);}_0x4bc236?this['_echartsContainer']['style']['visibility']='visible':this[_0x5666b8(0x221,0x205)][_0x5666b8(_0x1d18a5._0x42088c,0x243)]['visibility']=_0x126628(0x167,0x149);}['_mountedHook'](){const _0x56d3e1={_0xa8ee0d:0x38a,_0x3a9b4c:0x13e,_0xa98029:0x37d,_0x32eb95:0x365},_0x5b6365={_0x3d0f67:0x102};this[_0x506d02(0x386,_0x56d3e1._0xa8ee0d)]['scene'][_0x55aa88(0x12f,_0x56d3e1._0x3a9b4c)]=this['options']['depthTest']??!![];function _0x506d02(_0x3c2c06,_0x42976a){return _0x14f71c(_0x42976a- -_0x5b6365._0x3d0f67,_0x3c2c06);}this['_map']['scene']['echartsAutoHeight']=this['options']['clampToGround']??![];function _0x55aa88(_0xc7b3e5,_0xbe5e77){return _0x24595c(_0xbe5e77,_0xc7b3e5-0x3d0);}this['_map']['scene'][_0x506d02(_0x56d3e1._0xa98029,_0x56d3e1._0x32eb95)]=this[_0x55aa88(0x137,0x15c)]['fixedHeight']??0x0;}['_addedHook'](){const _0x4f5172={_0x37b800:0x230,_0x20e258:0x25c,_0x3761d6:0x27a,_0x5cfcfc:0x253};this[_0x4246f6(-_0x4f5172._0x37b800,-0x258)]=this[_0x36003a(0x20e,0x224)]();function _0x36003a(_0x154eb5,_0x54f6c4){return _0x24595c(_0x154eb5,_0x54f6c4-0x508);}this[_0x4246f6(-0x274,-_0x4f5172._0x20e258)]=echarts__namespace['init'](this['_echartsContainer']);function _0x4246f6(_0x3edcc8,_0x204490){return _0x14f71c(_0x204490- -0x6b8,_0x3edcc8);}this['_echartsInstance']['_mars3d_scene']=this[_0x36003a(0x247,0x26d)][_0x36003a(_0x4f5172._0x3761d6,_0x4f5172._0x5cfcfc)],this['setEchartsOption'](this['options']);}['_removedHook'](){const _0x4d6a8f={_0x54ec2f:0x3a4,_0x184bb2:0x3cb,_0x1f1bb1:0x382,_0xb6dfc0:0x39a};function _0x4979ec(_0x19a80c,_0x104fb0){return _0x24595c(_0x19a80c,_0x104fb0-0x757);}function _0x39accd(_0x255cd5,_0x57b6ee){return _0x24595c(_0x255cd5,_0x57b6ee-0x661);}this['_echartsInstance']&&(this['_echartsInstance'][_0x39accd(0x3c5,_0x4d6a8f._0x54ec2f)](),this[_0x39accd(0x370,0x396)]['dispose'](),delete this['_echartsInstance']),this['_echartsContainer']&&(this[_0x39accd(_0x4d6a8f._0x184bb2,0x3c6)]['container']['removeChild'](this[_0x39accd(_0x4d6a8f._0x1f1bb1,_0x4d6a8f._0xb6dfc0)]),delete this['_echartsContainer']);}[_0x14f71c(0x443,0x449)](){const _0xf1900f={_0x2aafd2:0x18a,_0x4bd949:0x18f,_0x4939e6:0x264,_0x508476:0x27c,_0x575b3c:0x26a,_0x58ef5a:0x26f,_0x2c4626:0x1b5,_0x14d610:0x1db,_0xa81422:0x1c3,_0x21dd6e:0x1ee,_0x1453d1:0x1ac,_0x19c4e6:0x17c,_0x1fa3e0:0x198,_0x5f17a8:0x1cd},_0x141994=mars3d__namespace['DomUtil'][_0x2cd686(_0xf1900f._0x2aafd2,_0xf1900f._0x4bd949)]('div',_0x41658d(0x246,_0xf1900f._0x4939e6),this['_map'][_0x41658d(_0xf1900f._0x508476,0x25a)]);_0x141994['id']=this['id'],_0x141994[_0x41658d(_0xf1900f._0x575b3c,0x287)]['position']=_0x41658d(_0xf1900f._0x58ef5a,0x289),_0x141994['style']['top']='0px',_0x141994['style']['left']=_0x2cd686(0x1b7,_0xf1900f._0x2c4626),_0x141994['style']['width']=this['_map'][_0x2cd686(_0xf1900f._0x14d610,_0xf1900f._0xa81422)]['canvas'][_0x2cd686(0x1aa,0x1d3)]+'px';function _0x2cd686(_0x41c9eb,_0x518bbf){return _0x14f71c(_0x518bbf- -0x2af,_0x41c9eb);}function _0x41658d(_0x11819c,_0x25a4c4){return _0x24595c(_0x11819c,_0x25a4c4-0x532);}return _0x141994['style']['height']=this['_map'][_0x2cd686(_0xf1900f._0x21dd6e,0x1c3)]['canvas'][_0x2cd686(_0xf1900f._0x1453d1,0x1c9)]+'px',_0x141994['style']['pointerEvents']=this['_pointerEvents']?'all':_0x2cd686(_0xf1900f._0x19c4e6,_0xf1900f._0x1fa3e0),_0x141994[_0x2cd686(0x1aa,_0xf1900f._0x5f17a8)]['zIndex']=this['options'][_0x41658d(0x2a8,0x298)]??0x9,_0x141994;}['resize'](){const _0x30a485={_0x40c374:0x286,_0x1b6f00:0xf},_0x136cee={_0x36ab38:0x2f5};if(!this['_echartsInstance'])return;function _0x83510(_0x66643,_0x55344d){return _0x24595c(_0x66643,_0x55344d-0x69);}function _0x3cf4d2(_0x405139,_0x1067c3){return _0x24595c(_0x405139,_0x1067c3-_0x136cee._0x36ab38);}this[_0x83510(-_0x30a485._0x40c374,-0x25e)]['style'][_0x3cf4d2(0x7b,0x55)]=this['_map']['scene'][_0x3cf4d2(_0x30a485._0x1b6f00,0x10)]['clientWidth']+'px',this['_echartsContainer']['style']['height']=this['_map']['scene'][_0x83510(-0x26d,-0x27c)][_0x3cf4d2(0x25,0x46)]+'px',this['_echartsInstance']['resize']();}[_0x14f71c(0x44a,0x446)](_0x1a7cd9,_0x428dba,_0x1fc531){const _0x182dbd={_0x31bc7e:0x36d,_0x3208a8:0x38f,_0x5391e4:0x19f,_0x24cb30:0x1bf,_0x26a912:0x1d0,_0x463c07:0x3a7},_0x16555f={_0x381852:0x47a},_0x2d8a69={_0x1f5717:0xb5};function _0x3e7687(_0x5d0f2e,_0x1f9fdd){return _0x14f71c(_0x1f9fdd- -_0x2d8a69._0x1f5717,_0x5d0f2e);}function _0x7ccc98(_0x4540a7,_0x39d5ba){return _0x24595c(_0x4540a7,_0x39d5ba-_0x16555f._0x381852);}if(this[_0x3e7687(0x37d,0x3a7)]){const _0x109181={};_0x109181[_0x3e7687(_0x182dbd._0x31bc7e,_0x182dbd._0x3208a8)]=!![],_0x1a7cd9={'mars3dMap':{},...mars3d__namespace['Util'][_0x7ccc98(_0x182dbd._0x5391e4,_0x182dbd._0x24cb30)](_0x1a7cd9,_0x109181)},delete _0x1a7cd9[_0x7ccc98(0x1bd,_0x182dbd._0x26a912)],this[_0x3e7687(0x3b0,_0x182dbd._0x463c07)][_0x7ccc98(0x18b,0x1a9)](_0x1a7cd9,_0x428dba,_0x1fc531);}}[_0x24595c(-0x270,-0x293)](_0x3357fc){const _0x10c9da={_0x4e41c8:0x439,_0x8b9f6b:0x43e},_0x9f55d9={_0x19d00e:0x209,_0x42f0d8:0x20e},_0x51d708={_0x5c9fe6:0x243},_0x378316={_0x14ef2b:0x334};let _0x5f3337,_0x35282a,_0x2cf441,_0x35dd07;function _0x1b27bf(_0x34589d){if(!Array['isArray'](_0x34589d))return;const _0x9b09ad=_0x34589d[0x0]||0x0;function _0x3bc393(_0x59805b,_0x368f91){return _0x162c(_0x368f91-0x24c,_0x59805b);}const _0x591e72=_0x34589d[0x1]||0x0;_0x9b09ad!==0x0&&_0x591e72!==0x0&&(_0x5f3337===undefined?(_0x5f3337=_0x9b09ad,_0x35282a=_0x9b09ad,_0x2cf441=_0x591e72,_0x35dd07=_0x591e72):(_0x5f3337=Math[_0x3bc393(_0x378316._0x14ef2b,0x35c)](_0x5f3337,_0x9b09ad),_0x35282a=Math['max'](_0x35282a,_0x9b09ad),_0x2cf441=Math['min'](_0x2cf441,_0x591e72),_0x35dd07=Math['max'](_0x35dd07,_0x591e72)));}function _0x3e5451(_0x3b2c1f,_0x1b016a){return _0x24595c(_0x1b016a,_0x3b2c1f-0x6f4);}const _0x2bc900=this['options']['series'];_0x2bc900&&_0x2bc900[_0x3e5451(0x451,0x452)](_0x1942b3=>{const _0x518ab7={_0x41fcd5:0x373};function _0xa2375(_0x1d8bc5,_0x4916ac){return _0x3e5451(_0x4916ac- -_0x51d708._0x5c9fe6,_0x1d8bc5);}_0x1942b3['data']&&_0x1942b3['data'][_0xa2375(_0x9f55d9._0x19d00e,_0x9f55d9._0x42f0d8)](_0x2d9e0f=>{function _0x3a5bb3(_0x578cee,_0x8b0366){return _0xa2375(_0x8b0366,_0x578cee-0x1a4);}if(_0x2d9e0f[_0x3a5bb3(0x38d,_0x518ab7._0x41fcd5)])_0x1b27bf(_0x2d9e0f['value']);else _0x2d9e0f['coords']&&_0x2d9e0f['coords']['forEach'](_0x1c527d=>{_0x1b27bf(_0x1c527d);});});});if(_0x5f3337===0x0&&_0x2cf441===0x0&&_0x35282a===0x0&&_0x35dd07===0x0)return null;function _0x352c81(_0x3f6531,_0x53d492){return _0x14f71c(_0x3f6531- -0x53,_0x53d492);}if(_0x3357fc!==null&&_0x3357fc!==void 0x0&&_0x3357fc['isFormat']){const _0x2010cd={};return _0x2010cd['xmin']=_0x5f3337,_0x2010cd[_0x352c81(0x41e,_0x10c9da._0x4e41c8)]=_0x35282a,_0x2010cd['ymin']=_0x2cf441,_0x2010cd['ymax']=_0x35dd07,_0x2010cd;}else return Cesium[_0x352c81(_0x10c9da._0x8b9f6b,0x416)]['fromDegrees'](_0x5f3337,_0x2cf441,_0x35282a,_0x35dd07);}['on'](_0x3344c4,_0x721013,_0x49e6b4){const _0x112bfc={_0x54c113:0xd9};this[_0x4da85d(_0x112bfc._0x54c113,0x102)]['on'](_0x3344c4,_0x721013,_0x49e6b4||this);function _0x4da85d(_0x4abe1f,_0x2e1bcd){return _0x24595c(_0x4abe1f,_0x2e1bcd-0x3cd);}return this;}[_0x14f71c(0x476,0x495)](_0x4c7d40,_0x4a89db,_0xdd0e49,_0x3e329b){return this['_echartsInstance']['on'](_0x4c7d40,_0x4a89db,_0xdd0e49,_0x3e329b||this),this;}[_0x24595c(-0x2b6,-0x295)](_0x4e3c32,_0x44aead,_0x3dfdfd){const _0x5ee0e9={_0x460fa5:0x1b4,_0x524bba:0x195};this[_0x12a2f7(_0x5ee0e9._0x460fa5,_0x5ee0e9._0x524bba)]['off'](_0x4e3c32,_0x44aead,_0x3dfdfd||this);function _0x12a2f7(_0x1319e2,_0x1a54fe){return _0x24595c(_0x1a54fe,_0x1319e2-0x47f);}return this;}}mars3d__namespace['LayerUtil'][_0x24595c(-0x2db,-0x2e7)]('echarts',EchartsLayer),mars3d__namespace['layer'][_0x24595c(-0x2c1,-0x2c1)]=EchartsLayer,mars3d__namespace[_0x24595c(-0x2ef,-0x2d7)]=echarts__namespace,exports[_0x14f71c(0x466,0x449)]=EchartsLayer,Object['keys'](echarts)[_0x14f71c(0x484,0x476)](function(_0x3e6d4b){const _0x3ddaa8={_0x12c19a:0x216},_0x409402={_0x5a0eb5:0x269};function _0x14b0f6(_0x2ca2c9,_0x287499){return _0x14f71c(_0x2ca2c9- -_0x409402._0x5a0eb5,_0x287499);}if(_0x3e6d4b!=='default'&&!exports['hasOwnProperty'](_0x3e6d4b))Object[_0x14b0f6(_0x3ddaa8._0x12c19a,0x204)](exports,_0x3e6d4b,{'enumerable':!![],'get':function(){return echarts[_0x3e6d4b];}});});const _0x105462={};_0x105462[_0x24595c(-0x2b7,-0x2c8)]=!![],Object[_0x14f71c(0x47f,0x4ab)](exports,'__esModule',_0x105462);
}));
