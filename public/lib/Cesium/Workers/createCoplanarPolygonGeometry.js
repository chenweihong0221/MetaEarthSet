/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.119
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as et}from"./chunk-ZUOZYKYZ.js";import{a as U}from"./chunk-DMIF3TJ3.js";import"./chunk-VJTHPHYB.js";import{a as y}from"./chunk-DH3YQ56F.js";import"./chunk-BWSUBYAI.js";import{a as I}from"./chunk-3HJM4DNA.js";import{a as $}from"./chunk-6APME2VO.js";import"./chunk-ZVFSUDGR.js";import"./chunk-QJHYMZPL.js";import{a as u}from"./chunk-ZLFFYFO6.js";import"./chunk-I33DDHVP.js";import"./chunk-7TYSIAS6.js";import{b as ot}from"./chunk-VMVQRCQY.js";import{a as tt}from"./chunk-L534BPPX.js";import"./chunk-4QTCIDG4.js";import"./chunk-4WSWBQPX.js";import"./chunk-PSM2OZFQ.js";import{a as J}from"./chunk-TPVKDNQ2.js";import{a as X}from"./chunk-L2WB5XBS.js";import{b as W,c as Y,d as z}from"./chunk-MKOJDBDR.js";import{d as K}from"./chunk-6IEKOAAO.js";import{f as Q}from"./chunk-FI7FQWFK.js";import{a as N}from"./chunk-QU7IDCXZ.js";import{a as i,c as x,d as m,e as P}from"./chunk-A37TTN4T.js";import{a as q}from"./chunk-U4UUGLXG.js";import"./chunk-3GUOVF7B.js";import"./chunk-ZWNHW2OC.js";import{a as f}from"./chunk-SQHFMRD4.js";import{b as B}from"./chunk-GDH3Q66C.js";import{e as g}from"./chunk-IWAQ2DE4.js";var st=new i,at=new et,pt=new x,lt=new x,mt=new i,ft=new i,ut=new i,V=new i,yt=new i,ht=new i,nt=new Q,dt=new P,gt=new P,Pt=new i;function wt(e,t,o,a,h,A,r,n,p){let b=e.positions,c=ot.triangulate(e.positions2D,e.holes);c.length<3&&(c=[0,1,2]);let w=J.createTypedArray(b.length,c.length);w.set(c);let D=dt;if(a!==0){let d=Q.fromAxisAngle(r,a,nt);if(D=P.fromQuaternion(d,D),t.tangent||t.bitangent){d=Q.fromAxisAngle(r,-a,nt);let G=P.fromQuaternion(d,gt);n=i.normalize(P.multiplyByVector(G,n,n),n),t.bitangent&&(p=i.normalize(i.cross(r,n,p),p))}}else D=P.clone(P.IDENTITY,D);let j=lt;t.st&&(j.x=o.x,j.y=o.y);let k=b.length,C=k*3,L=new Float64Array(C),T=t.normal?new Float32Array(C):void 0,R=t.tangent?new Float32Array(C):void 0,S=t.bitangent?new Float32Array(C):void 0,H=t.st?new Float32Array(k*2):void 0,M=0,F=0,l=0,O=0,s=0;for(let d=0;d<k;d++){let G=b[d];if(L[M++]=G.x,L[M++]=G.y,L[M++]=G.z,t.st)if(g(h)&&h.positions.length===k)H[s++]=h.positions[d].x,H[s++]=h.positions[d].y;else{let it=P.multiplyByVector(D,G,st),v=A(it,pt);x.subtract(v,j,v);let rt=q.clamp(v.x/o.width,0,1),ct=q.clamp(v.y/o.height,0,1);H[s++]=rt,H[s++]=ct}t.normal&&(T[F++]=r.x,T[F++]=r.y,T[F++]=r.z),t.tangent&&(R[O++]=n.x,R[O++]=n.y,R[O++]=n.z),t.bitangent&&(S[l++]=p.x,S[l++]=p.y,S[l++]=p.z)}let _=new X;return t.position&&(_.position=new z({componentDatatype:N.DOUBLE,componentsPerAttribute:3,values:L})),t.normal&&(_.normal=new z({componentDatatype:N.FLOAT,componentsPerAttribute:3,values:T})),t.tangent&&(_.tangent=new z({componentDatatype:N.FLOAT,componentsPerAttribute:3,values:R})),t.bitangent&&(_.bitangent=new z({componentDatatype:N.FLOAT,componentsPerAttribute:3,values:S})),t.st&&(_.st=new z({componentDatatype:N.FLOAT,componentsPerAttribute:2,values:H})),new Y({attributes:_,indices:w,primitiveType:W.TRIANGLES})}function E(e){e=f(e,f.EMPTY_OBJECT);let t=e.polygonHierarchy,o=e.textureCoordinates;B.defined("options.polygonHierarchy",t);let a=f(e.vertexFormat,u.DEFAULT);this._vertexFormat=u.clone(a),this._polygonHierarchy=t,this._stRotation=f(e.stRotation,0),this._ellipsoid=m.clone(f(e.ellipsoid,m.default)),this._workerName="createCoplanarPolygonGeometry",this._textureCoordinates=o,this.packedLength=y.computeHierarchyPackedLength(t,i)+u.packedLength+m.packedLength+(g(o)?y.computeHierarchyPackedLength(o,x):1)+2}E.fromPositions=function(e){e=f(e,f.EMPTY_OBJECT),B.defined("options.positions",e.positions);let t={polygonHierarchy:{positions:e.positions},vertexFormat:e.vertexFormat,stRotation:e.stRotation,ellipsoid:e.ellipsoid,textureCoordinates:e.textureCoordinates};return new E(t)};E.pack=function(e,t,o){return B.typeOf.object("value",e),B.defined("array",t),o=f(o,0),o=y.packPolygonHierarchy(e._polygonHierarchy,t,o,i),m.pack(e._ellipsoid,t,o),o+=m.packedLength,u.pack(e._vertexFormat,t,o),o+=u.packedLength,t[o++]=e._stRotation,g(e._textureCoordinates)?o=y.packPolygonHierarchy(e._textureCoordinates,t,o,x):t[o++]=-1,t[o++]=e.packedLength,t};var _t=m.clone(m.UNIT_SPHERE),At=new u,bt={polygonHierarchy:{}};E.unpack=function(e,t,o){B.defined("array",e),t=f(t,0);let a=y.unpackPolygonHierarchy(e,t,i);t=a.startingIndex,delete a.startingIndex;let h=m.unpack(e,t,_t);t+=m.packedLength;let A=u.unpack(e,t,At);t+=u.packedLength;let r=e[t++],n=e[t]===-1?void 0:y.unpackPolygonHierarchy(e,t,x);g(n)?(t=n.startingIndex,delete n.startingIndex):t++;let p=e[t++];return g(o)||(o=new E(bt)),o._polygonHierarchy=a,o._ellipsoid=m.clone(h,o._ellipsoid),o._vertexFormat=u.clone(A,o._vertexFormat),o._stRotation=r,o._textureCoordinates=n,o.packedLength=p,o};E.createGeometry=function(e){let t=e._vertexFormat,o=e._polygonHierarchy,a=e._stRotation,h=e._textureCoordinates,A=g(h),r=o.positions;if(r=tt(r,i.equalsEpsilon,!0),r.length<3)return;let n=mt,p=ft,b=ut,c=yt,w=ht;if(!U.computeProjectTo2DArguments(r,V,c,w))return;if(n=i.cross(c,w,n),n=i.normalize(n,n),!i.equalsEpsilon(V,i.ZERO,q.EPSILON6)){let s=e._ellipsoid.geodeticSurfaceNormal(V,Pt);i.dot(n,s)<0&&(n=i.negate(n,n),c=i.negate(c,c))}let j=U.createProjectPointsTo2DFunction(V,c,w),k=U.createProjectPointTo2DFunction(V,c,w);t.tangent&&(p=i.clone(c,p)),t.bitangent&&(b=i.clone(w,b));let C=y.polygonsFromHierarchy(o,A,j,!1),L=C.hierarchy,T=C.polygons,R=function(s){return s},S=A?y.polygonsFromHierarchy(h,!0,R,!1).polygons:void 0;if(L.length===0)return;r=L[0].outerRing;let H=K.fromPoints(r),M=y.computeBoundingRectangle(n,k,r,a,at),F=[];for(let s=0;s<T.length;s++){let _=new I({geometry:wt(T[s],t,M,a,A?S[s]:void 0,k,n,p,b)});F.push(_)}let l=$.combineInstances(F)[0];l.attributes.position.values=new Float64Array(l.attributes.position.values),l.indices=J.createTypedArray(l.attributes.position.values.length/3,l.indices);let O=l.attributes;return t.position||delete O.position,new Y({attributes:O,indices:l.indices,primitiveType:l.primitiveType,boundingSphere:H})};var Z=E;function kt(e,t){return g(t)&&(e=Z.unpack(e,t)),Z.createGeometry(e)}var Xt=kt;export{Xt as default};
