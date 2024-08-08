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

import{a as J}from"./chunk-4IAJQOFI.js";import{a as Nt}from"./chunk-3HJM4DNA.js";import{a as zt}from"./chunk-6APME2VO.js";import"./chunk-ZVFSUDGR.js";import"./chunk-QJHYMZPL.js";import{a as ut}from"./chunk-EDMSGCXM.js";import{a as X}from"./chunk-ZLFFYFO6.js";import{b as Rt}from"./chunk-VMVQRCQY.js";import"./chunk-4QTCIDG4.js";import"./chunk-4WSWBQPX.js";import"./chunk-PSM2OZFQ.js";import{a as yt}from"./chunk-TPVKDNQ2.js";import{a as Vt}from"./chunk-L2WB5XBS.js";import{b as Mt,c as Pt,d as q}from"./chunk-MKOJDBDR.js";import{d as st}from"./chunk-6IEKOAAO.js";import{f as Lt,h as E,i as At}from"./chunk-FI7FQWFK.js";import{a as Y}from"./chunk-QU7IDCXZ.js";import{a as _,b as wt,c as G,d as H,e as ft}from"./chunk-A37TTN4T.js";import{a as W}from"./chunk-U4UUGLXG.js";import"./chunk-3GUOVF7B.js";import"./chunk-ZWNHW2OC.js";import{a as L}from"./chunk-SQHFMRD4.js";import{a as St,b as lt}from"./chunk-GDH3Q66C.js";import{e as $}from"./chunk-IWAQ2DE4.js";var Tt=new _,Bt=new _,Ut=new _,Yt=new _,qt=new E,Zt=new G,Kt=new st,$t=new st;function Xt(t,e){let n=new Pt({attributes:new Vt,primitiveType:Mt.TRIANGLES});return n.attributes.position=new q({componentDatatype:Y.DOUBLE,componentsPerAttribute:3,values:e.positions}),t.normal&&(n.attributes.normal=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:3,values:e.normals})),t.tangent&&(n.attributes.tangent=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:3,values:e.tangents})),t.bitangent&&(n.attributes.bitangent=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:3,values:e.bitangents})),n}function Gt(t,e,n,r){let a=t.length,c=e.normal?new Float32Array(a):void 0,l=e.tangent?new Float32Array(a):void 0,u=e.bitangent?new Float32Array(a):void 0,d=0,p=Yt,o=Ut,i=Bt;if(e.normal||e.tangent||e.bitangent)for(let f=0;f<a;f+=3){let s=_.fromArray(t,f,Tt),h=d+1,g=d+2;i=n.geodeticSurfaceNormal(s,i),(e.tangent||e.bitangent)&&(_.cross(_.UNIT_Z,i,o),ft.multiplyByVector(r,o,o),_.normalize(o,o),e.bitangent&&_.normalize(_.cross(i,o,p),p)),e.normal&&(c[d]=i.x,c[h]=i.y,c[g]=i.z),e.tangent&&(l[d]=o.x,l[h]=o.y,l[g]=o.z),e.bitangent&&(u[d]=p.x,u[h]=p.y,u[g]=p.z),d+=3}return Xt(e,{positions:t,normals:c,tangents:l,bitangents:u})}var Ct=new _,jt=new _;function te(t,e,n){let r=t.length,a=e.normal?new Float32Array(r):void 0,c=e.tangent?new Float32Array(r):void 0,l=e.bitangent?new Float32Array(r):void 0,u=0,d=0,p=0,o=!0,i=Yt,f=Ut,s=Bt;if(e.normal||e.tangent||e.bitangent)for(let h=0;h<r;h+=6){let g=_.fromArray(t,h,Tt),A=_.fromArray(t,(h+6)%r,Ct);if(o){let b=_.fromArray(t,(h+3)%r,jt);_.subtract(A,g,A),_.subtract(b,g,b),s=_.normalize(_.cross(b,A,s),s),o=!1}_.equalsEpsilon(A,g,W.EPSILON10)&&(o=!0),(e.tangent||e.bitangent)&&(i=n.geodeticSurfaceNormal(g,i),e.tangent&&(f=_.normalize(_.cross(i,s,f),f))),e.normal&&(a[u++]=s.x,a[u++]=s.y,a[u++]=s.z,a[u++]=s.x,a[u++]=s.y,a[u++]=s.z),e.tangent&&(c[d++]=f.x,c[d++]=f.y,c[d++]=f.z,c[d++]=f.x,c[d++]=f.y,c[d++]=f.z),e.bitangent&&(l[p++]=i.x,l[p++]=i.y,l[p++]=i.z,l[p++]=i.x,l[p++]=i.y,l[p++]=i.z)}return Xt(e,{positions:t,normals:a,tangents:c,bitangents:l})}function It(t,e){let n=t._vertexFormat,r=t._ellipsoid,a=e.height,c=e.width,l=e.northCap,u=e.southCap,d=0,p=a,o=a,i=0;l&&(d=1,o-=1,i+=1),u&&(p-=1,o-=1,i+=1),i+=c*o;let f=n.position?new Float64Array(i*3):void 0,s=n.st?new Float32Array(i*2):void 0,h=0,g=0,A=Tt,b=Zt,z=Number.MAX_VALUE,F=Number.MAX_VALUE,j=-Number.MAX_VALUE,T=-Number.MAX_VALUE;for(let x=d;x<p;++x)for(let k=0;k<c;++k)J.computePosition(e,r,n.st,x,k,A,b),f[h++]=A.x,f[h++]=A.y,f[h++]=A.z,n.st&&(s[g++]=b.x,s[g++]=b.y,z=Math.min(z,b.x),F=Math.min(F,b.y),j=Math.max(j,b.x),T=Math.max(T,b.y));if(l&&(J.computePosition(e,r,n.st,0,0,A,b),f[h++]=A.x,f[h++]=A.y,f[h++]=A.z,n.st&&(s[g++]=b.x,s[g++]=b.y,z=b.x,F=b.y,j=b.x,T=b.y)),u&&(J.computePosition(e,r,n.st,a-1,0,A,b),f[h++]=A.x,f[h++]=A.y,f[h]=A.z,n.st&&(s[g++]=b.x,s[g]=b.y,z=Math.min(z,b.x),F=Math.min(F,b.y),j=Math.max(j,b.x),T=Math.max(T,b.y))),n.st&&(z<0||F<0||j>1||T>1))for(let x=0;x<s.length;x+=2)s[x]=(s[x]-z)/(j-z),s[x+1]=(s[x+1]-F)/(T-F);let m=Gt(f,n,r,e.tangentRotationMatrix),K=6*(c-1)*(o-1);l&&(K+=3*(c-1)),u&&(K+=3*(c-1));let P=yt.createTypedArray(i,K),D=0,N=0,O;for(O=0;O<o-1;++O){for(let x=0;x<c-1;++x){let k=D,M=k+c,I=M+1,rt=k+1;P[N++]=k,P[N++]=M,P[N++]=rt,P[N++]=rt,P[N++]=M,P[N++]=I,++D}++D}if(l||u){let x=i-1,k=i-1;l&&u&&(x=i-2);let M,I;if(D=0,l)for(O=0;O<c-1;O++)M=D,I=M+1,P[N++]=x,P[N++]=M,P[N++]=I,++D;if(u)for(D=(o-1)*c,O=0;O<c-1;O++)M=D,I=M+1,P[N++]=M,P[N++]=k,P[N++]=I,++D}return m.indices=P,n.st&&(m.attributes.st=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:2,values:s})),m}function ht(t,e,n,r,a){return t[e++]=r[n],t[e++]=r[n+1],t[e++]=r[n+2],t[e++]=a[n],t[e++]=a[n+1],t[e]=a[n+2],t}function dt(t,e,n,r){return t[e++]=r[n],t[e++]=r[n+1],t[e++]=r[n],t[e]=r[n+1],t}var Dt=new X;function ee(t,e){let n=t._shadowVolume,r=t._offsetAttribute,a=t._vertexFormat,c=t._extrudedHeight,l=t._surfaceHeight,u=t._ellipsoid,d=e.height,p=e.width,o;if(n){let R=X.clone(a,Dt);R.normal=!0,t._vertexFormat=R}let i=It(t,e);n&&(t._vertexFormat=a);let f=Rt.scaleToGeodeticHeight(i.attributes.position.values,l,u,!1);f=new Float64Array(f);let s=f.length,h=s*2,g=new Float64Array(h);g.set(f);let A=Rt.scaleToGeodeticHeight(i.attributes.position.values,c,u);g.set(A,s),i.attributes.position.values=g;let b=a.normal?new Float32Array(h):void 0,z=a.tangent?new Float32Array(h):void 0,F=a.bitangent?new Float32Array(h):void 0,j=a.st?new Float32Array(h/3*2):void 0,T,m;if(a.normal){for(m=i.attributes.normal.values,b.set(m),o=0;o<s;o++)m[o]=-m[o];b.set(m,s),i.attributes.normal.values=b}if(n){m=i.attributes.normal.values,a.normal||(i.attributes.normal=void 0);let R=new Float32Array(h);for(o=0;o<s;o++)m[o]=-m[o];R.set(m,s),i.attributes.extrudeDirection=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:3,values:R})}let K,P=$(r);if(P){let R=s/3*2,at=new Uint8Array(R);r===ut.TOP?at=at.fill(1,0,R/2):(K=r===ut.NONE?0:1,at=at.fill(K)),i.attributes.applyOffset=new q({componentDatatype:Y.UNSIGNED_BYTE,componentsPerAttribute:1,values:at})}if(a.tangent){let R=i.attributes.tangent.values;for(z.set(R),o=0;o<s;o++)R[o]=-R[o];z.set(R,s),i.attributes.tangent.values=z}if(a.bitangent){let R=i.attributes.bitangent.values;F.set(R),F.set(R,s),i.attributes.bitangent.values=F}a.st&&(T=i.attributes.st.values,j.set(T),j.set(T,s/3*2),i.attributes.st.values=j);let D=i.indices,N=D.length,O=s/3,x=yt.createTypedArray(h/3,N*2);for(x.set(D),o=0;o<N;o+=3)x[o+N]=D[o+2]+O,x[o+1+N]=D[o+1]+O,x[o+2+N]=D[o]+O;i.indices=x;let k=e.northCap,M=e.southCap,I=d,rt=2,pt=0,xt=4,Et=4;k&&(rt-=1,I-=1,pt+=1,xt-=2,Et-=1),M&&(rt-=1,I-=1,pt+=1,xt-=2,Et-=1),pt+=rt*p+2*I-xt;let gt=(pt+Et)*2,C=new Float64Array(gt*3),S=n?new Float32Array(gt*3):void 0,Z=P?new Uint8Array(gt):void 0,V=a.st?new Float32Array(gt*2):void 0,et=r===ut.TOP;P&&!et&&(K=r===ut.ALL?1:0,Z=Z.fill(K));let v=0,B=0,y=0,U=0,nt=p*I,w;for(o=0;o<nt;o+=p)w=o*3,C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,o*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1);if(M){let R=k?nt+1:nt;for(w=R*3,o=0;o<2;o++)C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,R*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1)}else for(o=nt-p;o<nt;o++)w=o*3,C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,o*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1);for(o=nt-1;o>0;o-=p)w=o*3,C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,o*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1);if(k){let R=nt;for(w=R*3,o=0;o<2;o++)C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,R*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1)}else for(o=p-1;o>=0;o--)w=o*3,C=ht(C,v,w,f,A),v+=6,a.st&&(V=dt(V,B,o*2,T),B+=4),n&&(y+=3,S[y++]=m[w],S[y++]=m[w+1],S[y++]=m[w+2]),et&&(Z[U++]=1,U+=1);let ot=te(C,a,u);a.st&&(ot.attributes.st=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:2,values:V})),n&&(ot.attributes.extrudeDirection=new q({componentDatatype:Y.FLOAT,componentsPerAttribute:3,values:S})),P&&(ot.attributes.applyOffset=new q({componentDatatype:Y.UNSIGNED_BYTE,componentsPerAttribute:1,values:Z}));let it=yt.createTypedArray(gt,pt*6),mt,_t,kt,bt;s=C.length/3;let ct=0;for(o=0;o<s-1;o+=2){mt=o,bt=(mt+2)%s;let R=_.fromArray(C,mt*3,Ct),at=_.fromArray(C,bt*3,jt);_.equalsEpsilon(R,at,W.EPSILON10)||(_t=(mt+1)%s,kt=(_t+2)%s,it[ct++]=mt,it[ct++]=_t,it[ct++]=bt,it[ct++]=bt,it[ct++]=_t,it[ct++]=kt)}return ot.indices=it,ot=zt.combineInstances([new Nt({geometry:i}),new Nt({geometry:ot})]),ot[0]}var ne=[new _,new _,new _,new _],Wt=new wt,oe=new wt;function Ht(t,e,n,r,a){if(n===0)return E.clone(t,a);let c=J.computeOptions(t,e,n,0,qt,Wt),l=c.height,u=c.width,d=ne;return J.computePosition(c,r,!1,0,0,d[0]),J.computePosition(c,r,!1,0,u-1,d[1]),J.computePosition(c,r,!1,l-1,0,d[2]),J.computePosition(c,r,!1,l-1,u-1,d[3]),E.fromCartesianArray(d,r,a)}function Q(t){t=L(t,L.EMPTY_OBJECT);let e=t.rectangle;if(lt.typeOf.object("rectangle",e),E.validate(e),e.north<e.south)throw new St("options.rectangle.north must be greater than or equal to options.rectangle.south");let n=L(t.height,0),r=L(t.extrudedHeight,n);this._rectangle=E.clone(e),this._granularity=L(t.granularity,W.RADIANS_PER_DEGREE),this._ellipsoid=H.clone(L(t.ellipsoid,H.default)),this._surfaceHeight=Math.max(n,r),this._rotation=L(t.rotation,0),this._stRotation=L(t.stRotation,0),this._vertexFormat=X.clone(L(t.vertexFormat,X.DEFAULT)),this._extrudedHeight=Math.min(n,r),this._shadowVolume=L(t.shadowVolume,!1),this._workerName="createRectangleGeometry",this._offsetAttribute=t.offsetAttribute,this._rotatedRectangle=void 0,this._textureCoordinateRotationPoints=void 0}Q.packedLength=E.packedLength+H.packedLength+X.packedLength+7;Q.pack=function(t,e,n){return lt.typeOf.object("value",t),lt.defined("array",e),n=L(n,0),E.pack(t._rectangle,e,n),n+=E.packedLength,H.pack(t._ellipsoid,e,n),n+=H.packedLength,X.pack(t._vertexFormat,e,n),n+=X.packedLength,e[n++]=t._granularity,e[n++]=t._surfaceHeight,e[n++]=t._rotation,e[n++]=t._stRotation,e[n++]=t._extrudedHeight,e[n++]=t._shadowVolume?1:0,e[n]=L(t._offsetAttribute,-1),e};var Jt=new E,Qt=H.clone(H.UNIT_SPHERE),tt={rectangle:Jt,ellipsoid:Qt,vertexFormat:Dt,granularity:void 0,height:void 0,rotation:void 0,stRotation:void 0,extrudedHeight:void 0,shadowVolume:void 0,offsetAttribute:void 0};Q.unpack=function(t,e,n){lt.defined("array",t),e=L(e,0);let r=E.unpack(t,e,Jt);e+=E.packedLength;let a=H.unpack(t,e,Qt);e+=H.packedLength;let c=X.unpack(t,e,Dt);e+=X.packedLength;let l=t[e++],u=t[e++],d=t[e++],p=t[e++],o=t[e++],i=t[e++]===1,f=t[e];return $(n)?(n._rectangle=E.clone(r,n._rectangle),n._ellipsoid=H.clone(a,n._ellipsoid),n._vertexFormat=X.clone(c,n._vertexFormat),n._granularity=l,n._surfaceHeight=u,n._rotation=d,n._stRotation=p,n._extrudedHeight=o,n._shadowVolume=i,n._offsetAttribute=f===-1?void 0:f,n):(tt.granularity=l,tt.height=u,tt.rotation=d,tt.stRotation=p,tt.extrudedHeight=o,tt.shadowVolume=i,tt.offsetAttribute=f===-1?void 0:f,new Q(tt))};Q.computeRectangle=function(t,e){t=L(t,L.EMPTY_OBJECT);let n=t.rectangle;if(lt.typeOf.object("rectangle",n),E.validate(n),n.north<n.south)throw new St("options.rectangle.north must be greater than or equal to options.rectangle.south");let r=L(t.granularity,W.RADIANS_PER_DEGREE),a=L(t.ellipsoid,H.default),c=L(t.rotation,0);return Ht(n,r,c,a,e)};var ie=new ft,Ft=new Lt,ae=new wt;Q.createGeometry=function(t){if(W.equalsEpsilon(t._rectangle.north,t._rectangle.south,W.EPSILON10)||W.equalsEpsilon(t._rectangle.east,t._rectangle.west,W.EPSILON10))return;let e=t._rectangle,n=t._ellipsoid,r=t._rotation,a=t._stRotation,c=t._vertexFormat,l=J.computeOptions(e,t._granularity,r,a,qt,Wt,oe),u=ie;if(a!==0||r!==0){let s=E.center(e,ae),h=n.geodeticSurfaceNormalCartographic(s,Ct);Lt.fromAxisAngle(h,-a,Ft),ft.fromQuaternion(Ft,u)}else ft.clone(ft.IDENTITY,u);let d=t._surfaceHeight,p=t._extrudedHeight,o=!W.equalsEpsilon(d,p,0,W.EPSILON2);l.lonScalar=1/t._rectangle.width,l.latScalar=1/t._rectangle.height,l.tangentRotationMatrix=u;let i,f;if(e=t._rectangle,o){i=ee(t,l);let s=st.fromRectangle3D(e,n,d,$t),h=st.fromRectangle3D(e,n,p,Kt);f=st.union(s,h)}else{if(i=It(t,l),i.attributes.position.values=Rt.scaleToGeodeticHeight(i.attributes.position.values,d,n,!1),$(t._offsetAttribute)){let s=i.attributes.position.values.length,h=t._offsetAttribute===ut.NONE?0:1,g=new Uint8Array(s/3).fill(h);i.attributes.applyOffset=new q({componentDatatype:Y.UNSIGNED_BYTE,componentsPerAttribute:1,values:g})}f=st.fromRectangle3D(e,n,d)}return c.position||delete i.attributes.position,new Pt({attributes:i.attributes,indices:i.indices,primitiveType:i.primitiveType,boundingSphere:f,offsetAttribute:t._offsetAttribute})};Q.createShadowVolume=function(t,e,n){let r=t._granularity,a=t._ellipsoid,c=e(r,a),l=n(r,a);return new Q({rectangle:t._rectangle,rotation:t._rotation,ellipsoid:a,stRotation:t._stRotation,granularity:r,extrudedHeight:l,height:c,vertexFormat:X.POSITION_ONLY,shadowVolume:!0})};var vt=new E,se=[new G,new G,new G],re=new At,ce=new wt;function le(t){if(t._stRotation===0)return[0,0,0,1,1,0];let e=E.clone(t._rectangle,vt),n=t._granularity,r=t._ellipsoid,a=t._rotation-t._stRotation,c=Ht(e,n,a,r,vt),l=se;l[0].x=c.west,l[0].y=c.south,l[1].x=c.west,l[1].y=c.north,l[2].x=c.east,l[2].y=c.south;let u=t.rectangle,d=At.fromRotation(t._stRotation,re),p=E.center(u,ce);for(let h=0;h<3;++h){let g=l[h];g.x-=p.longitude,g.y-=p.latitude,At.multiplyByVector(d,g,g),g.x+=p.longitude,g.y+=p.latitude,g.x=(g.x-u.west)/u.width,g.y=(g.y-u.south)/u.height}let o=l[0],i=l[1],f=l[2],s=new Array(6);return G.pack(o,s),G.pack(i,s,2),G.pack(f,s,4),s}Object.defineProperties(Q.prototype,{rectangle:{get:function(){return $(this._rotatedRectangle)||(this._rotatedRectangle=Ht(this._rectangle,this._granularity,this._rotation,this._ellipsoid)),this._rotatedRectangle}},textureCoordinateRotationPoints:{get:function(){return $(this._textureCoordinateRotationPoints)||(this._textureCoordinateRotationPoints=le(this)),this._textureCoordinateRotationPoints}}});var Ot=Q;function fe(t,e){return $(e)&&(t=Ot.unpack(t,e)),t._ellipsoid=H.clone(t._ellipsoid),t._rectangle=E.clone(t._rectangle),Ot.createGeometry(t)}var Ye=fe;export{Ye as default};
