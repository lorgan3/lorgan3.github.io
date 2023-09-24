var lt=Object.defineProperty;var at=(H,R,L)=>R in H?lt(H,R,{enumerable:!0,configurable:!0,writable:!0,value:L}):H[R]=L;var w=(H,R,L)=>(at(H,typeof R!="symbol"?R+"":R,L),L);(function(){"use strict";const H=t=>t.constructor.scale;function R(t){return t?"getTile"in t:!1}var L=(t=>(t[t.Unknown=0]="Unknown",t[t.Player=1]="Player",t[t.Enemy=2]="Enemy",t))(L||{}),v=(t=>(t[t.None=0]="None",t[t.Tower=1]="Tower",t[t.Slime=2]="Slime",t[t.Base=3]="Base",t[t.Bullet=4]="Bullet",t[t.Wall=5]="Wall",t[t.Mortar=6]="Mortar",t[t.Flamethrower=7]="Flamethrower",t[t.Flame=8]="Flame",t[t.Railgun=9]="Railgun",t[t.Rail=10]="Rail",t[t.ElectricFence=11]="ElectricFence",t[t.Fence=12]="Fence",t[t.Freezer=13]="Freezer",t[t.Tree=14]="Tree",t[t.Pine=15]="Pine",t[t.Cactus=16]="Cactus",t[t.Stump=17]="Stump",t[t.Rock=18]="Rock",t[t.Rock2=19]="Rock2",t[t.Rock3=20]="Rock3",t[t.Radar=21]="Radar",t[t.PowerPlant=22]="PowerPlant",t[t.Blueprint=23]="Blueprint",t[t.Shockwave=24]="Shockwave",t[t.Armory=25]="Armory",t[t.Market=26]="Market",t[t.SpeedBeacon=27]="SpeedBeacon",t[t.Runner=28]="Runner",t[t.DamageBeacon=29]="DamageBeacon",t[t.Laser=30]="Laser",t[t.LaserBeam=31]="LaserBeam",t[t.Flier=32]="Flier",t[t.Tank=33]="Tank",t[t.Rocket=34]="Rocket",t[t.WavePoint=35]="WavePoint",t[t.Barracks=36]="Barracks",t[t.Tesla=37]="Tesla",t[t.Spark=38]="Spark",t[t.Behemoth=39]="Behemoth",t[t.Bore=40]="Bore",t[t.Excavator=41]="Excavator",t[t.Convert=42]="Convert",t[t.Terraform=43]="Terraform",t[t.EmergencyRecharge=44]="EmergencyRecharge",t[t.EmergencyRepair=45]="EmergencyRepair",t))(v||{});[...new Set([3,21,22,25,26,36])];var N=(t=>(t[t.Undiscovered=0]="Undiscovered",t[t.Pending=1]="Pending",t[t.Discovered=2]="Discovered",t))(N||{}),d=(t=>(t[t.Void=0]="Void",t[t.Grass=1]="Grass",t[t.Stone=2]="Stone",t[t.Water=3]="Water",t[t.Obstructed=4]="Obstructed",t[t.Wall=5]="Wall",t[t.Spore=6]="Spore",t[t.ElectricFence=7]="ElectricFence",t[t.Fence=8]="Fence",t[t.Freezer=9]="Freezer",t[t.Bridge=10]="Bridge",t[t.Dirt=11]="Dirt",t[t.Snow=12]="Snow",t[t.Sand=13]="Sand",t[t.Ice=14]="Ice",t[t.PlayerBuilding=15]="PlayerBuilding",t[t.Tree=16]="Tree",t[t.Rock=17]="Rock",t[t.Base=18]="Base",t))(d||{}),X=(t=>(t[t.WaterAlt=19]="WaterAlt",t[t.WaterStill=20]="WaterStill",t[t.GrassFlower=21]="GrassFlower",t[t.GrassAlt=22]="GrassAlt",t[t.GrassPlain=23]="GrassPlain",t[t.SandAlt=24]="SandAlt",t[t.SnowAlt=25]="SnowAlt",t[t.IceAlt=26]="IceAlt",t[t.Static1=27]="Static1",t[t.Static2=28]="Static2",t[t.Static3=29]="Static3",t))(X||{});const J={19:3,20:3,21:1,22:1,23:1,24:13,25:12,26:14,27:0,28:0,29:0},Q=new Set([1,2,11,13,12]);[...new Set([...Q,3,14,10,16,17])];const Z={[v.Tower]:4,[v.Wall]:5,[v.Mortar]:4,[v.Flamethrower]:4,[v.Railgun]:4,[v.ElectricFence]:7,[v.Fence]:8,[v.Freezer]:9,[v.Radar]:18,[v.PowerPlant]:18,[v.Tree]:16,[v.Rock]:17,[v.Armory]:18,[v.Base]:18,[v.Market]:18,[v.SpeedBeacon]:4,[v.DamageBeacon]:4,[v.Laser]:4,[v.Barracks]:18,[v.Tesla]:4};class V{constructor(e,s,i=d.Void){w(this,"staticEntity",null);w(this,"hash");w(this,"actualType");w(this,"type");w(this,"towers",[]);w(this,"linkedAgents");w(this,"discoveryStatus",N.Undiscovered);this.x=e,this.y=s,this.altType=i,this.hash=`[${this.x}, ${this.y}]`,this.type=J[i]??i,this.actualType=this.type}serialize(){return{x:this.x,y:this.y,type:this.type}}getX(){return this.x}getY(){return this.y}getBaseType(){return this.type}getAltType(){return this.altType}getAnimation(){return this.type===d.Water?[d.Water,X.WaterAlt,X.WaterStill]:[this.altType]}getType(){return this.actualType}getStaticEntity(){return this.staticEntity}hasStaticEntity(){return this.staticEntity!==null}setStaticEntity(e){if(e===this.staticEntity)return;if(this.staticEntity!==null)throw new Error("A tile can only have 1 static entity.");const s=e.getAgent();R(s)&&s.getTile().getHash()===this.getHash()&&(s.updateTile(this),this.linkedAgents&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)),this.staticEntity=e,this.actualType=Z[e.getAgent().getType()]||this.type}clearStaticEntity(){this.staticEntity=null,this.actualType=this.type}isStaticEntityRoot(){var e;return((e=this.staticEntity)==null?void 0:e.getAgent().getTile())===this}addTower(e){this.towers.includes(e)||this.towers.push(e)}setDiscoveryStatus(e){this.discoveryStatus=e}isDiscovered(){return this.discoveryStatus===N.Discovered}getDiscoveryStatus(){return this.discoveryStatus}isCoveredByTower(){return this.isDiscovered()&&this.towers.length>0}removeTower(e){this.towers.splice(this.towers.indexOf(e),1)}getAvailableTowers(){return this.towers.filter(e=>e.getCooldown()<=0)}getTowers(){return this.towers}addLinkedAgent(e){var i;this.linkedAgents||(this.linkedAgents=new Set),this.linkedAgents.add(e);const s=(i=this.staticEntity)==null?void 0:i.getAgent();s&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)}removeLinkedAgent(e){var i;if(!this.linkedAgents)return;this.linkedAgents.delete(e);const s=(i=this.staticEntity)==null?void 0:i.getAgent();R(s)&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)}getLinkedAgents(){return this.linkedAgents}getHash(){return this.hash}sync(e){this.towers=e.towers,this.discoveryStatus=e.discoveryStatus}}var j=(t=>(t[t.StatUpdate=0]="StatUpdate",t[t.SurfaceChange=1]="SurfaceChange",t[t.BlackOut=2]="BlackOut",t[t.OpenBuildMenu=3]="OpenBuildMenu",t[t.CloseBuildMenu=4]="CloseBuildMenu",t[t.SelectPlaceable=5]="SelectPlaceable",t[t.ToggleShowCoverage=6]="ToggleShowCoverage",t[t.StartWave=7]="StartWave",t[t.EndWave=8]="EndWave",t[t.Unlock=9]="Unlock",t[t.Discover=10]="Discover",t[t.Spawn=11]="Spawn",t[t.Buy=12]="Buy",t[t.Sell=13]="Sell",t[t.HitBase=14]="HitBase",t[t.Lose=15]="Lose",t[t.Kill=16]="Kill",t[t.Pierce=17]="Pierce",t[t.Bomb=18]="Bomb",t[t.Stun=19]="Stun",t))(j||{});const z=class z{constructor(){w(this,"eventHandlers");z.instance=this,this.eventHandlers=new Map}addEventListener(e,s){return this.eventHandlers.has(e)?this.eventHandlers.get(e).add(s):this.eventHandlers.set(e,new Set([s])),()=>this.removeEventListener(e,s)}addEventListeners(e,s){const i=e.map(n=>this.addEventListener(n,s));return()=>i.forEach(n=>n())}removeEventListener(e,s){var i;(i=this.eventHandlers.get(e))==null||i.delete(s)}triggerEvent(e,...s){var i;(i=this.eventHandlers.get(e))==null||i.forEach(n=>n(...s))}static get Instance(){return this.instance}};w(z,"instance");let U=z;function q(t){return"getCooldown"in t}const E=t=>t.constructor.range,$=[[1,0],[-1,0],[0,1],[0,-1]],G=[...$,[1,1],[-1,-1],[-1,1],[1,-1]],O=class O{constructor(e,s){w(this,"tileBufferSize");this.buffer=e,this.staticEntityConstructor=s,this.tileBufferSize=this.withEntities?2:1}get width(){return this.buffer[0]}get height(){return this.buffer[1]}get withEntities(){return this.buffer[2]}getTile(e){const s=O.propertyCount+e*this.tileBufferSize,i=new V(e%this.width,Math.floor(e/this.width),this.buffer[s]);if(this.withEntities&&this.staticEntityConstructor){const n=this.staticEntityConstructor(this.buffer[s+1],i);n&&i.setStaticEntity(n)}return i}static serializeSurface(e,s){const i=s?2:1,n=new Uint8Array(O.propertyCount+e.map.length*i);n[0]=e.getWidth(),n[1]=e.getHeight(),n[2]=s?1:0;for(let h=0;h<e.map.length;h++){const a=e.map[h],o=h*i+O.propertyCount;if(n[o]=s?a.getAltType():a.getType(),s){const u=a.hasStaticEntity()&&a.getStaticEntity().getAgent().getTile()===a?a.getStaticEntity().getAgent():null;n[o+1]=(u==null?void 0:u.getType())??v.None}}return n}};w(O,"propertyCount",3);let P=O;class T{constructor(e){w(this,"map");w(this,"entities",[]);w(this,"deletedEntities",[]);w(this,"tickingEntities",[]);w(this,"entitiesMap",new Map);w(this,"towers",new Set);w(this,"width");w(this,"height");w(this,"dirty",!1);w(this,"_version",0);w(this,"changedTiles",new Set);w(this,"addedAgents",new Set);w(this,"removedAgents",new Set);w(this,"initialized",!1);this.width=e.width,this.height=e.height;const s=e instanceof P?e:e.generate;this.initialize(s??((i,n)=>new V(i,n))),this.initialized=!0}serialize(e){return new P(P.serializeSurface(this,e))}initialize(e){this.entities=[],this.deletedEntities=[],this.entitiesMap.clear(),Object.values(L).filter(i=>typeof i!="string").forEach(i=>this.entitiesMap.set(i,new Set)),this.map=new Array(this.width*this.height);const s=[];if(e instanceof P)for(let i=0;i<this.map.length;i++){const n=e.getTile(i);this.map[i]=n,n.hasStaticEntity()&&s.push(n.getStaticEntity())}else for(let i=0;i<this.height;i++)for(let n=0;n<this.width;n++){const h=e(n,i);this.map[i*this.width+n]=h,h.hasStaticEntity()&&s.push(h.getStaticEntity())}for(let i of s)this.spawnStatic(i.getAgent())}getTile(e,s,i=!1){return e>=this.width||e<0||s>=this.height||s<0?i?this.getTile(Math.max(Math.min(e,this.width-1),0),Math.max(Math.min(s,this.height-1),0)):void 0:this.map[s*this.width+e]}getEntityTiles(e,s,i){let n;if(s!==void 0)n=e;else{const h=e;n=h.getTile().getX(),s=h.getTile().getY(),i=H(h)}switch(i){case 1:return[this.map[s*this.width+n]];case 2:return[this.map[s*this.width+n],this.map[s*this.width+n+1],this.map[(s+1)*this.width+n],this.map[(s+1)*this.width+n+1]];default:throw new Error("Unsupported agent scale!")}}getAdjacentTiles(e,s=1,i=!1){return(i?G:$).map(([n,h])=>this.getTile(e.getX()+n*s,e.getY()+h*s)).filter(n=>!!n)}setTile(e){this.setTileInternal(e)}setTiles(e){e.map(s=>this.setTileInternal(s))}setTileInternal(e){this.dirty=!0,this._version++;const s=this.map[e.getY()*this.width+e.getX()];return s.hasStaticEntity()&&!e.hasStaticEntity()?e.setStaticEntity(s.getStaticEntity()):s.hasStaticEntity()&&this.despawnStatic(s.getStaticEntity().getAgent()),e.sync(s),this.map[e.getY()*this.width+e.getX()]=e,this.changedTiles.add(s),s}processChangedTiles(){this.changedTiles.size&&(U.Instance.triggerEvent(j.SurfaceChange,{affectedTiles:this.changedTiles,addedStaticAgents:this.addedAgents,removedStaticAgents:this.removedAgents}),this.changedTiles.clear(),this.addedAgents.clear(),this.removedAgents.clear())}getRow(e){const s=e*this.width;return this.map.slice(s,s+this.width)}getColumn(e){const s=new Array(this.height);for(let i=0;i<this.height;i++)s[i]=this.getTile(e,i);return s}getWidth(){return this.width}getHeight(){return this.height}forLine(e,s,i,n,h,a){const o=(a==null?void 0:a.scale)??1;e=Math.floor(e/o)*o,s=Math.floor(s/o)*o,i=Math.floor(i/o)*o,n=Math.floor(n/o)*o;const u=Math.atan2(n-s,i-e);return this.forRay(e,s,u,(p,f)=>!(h(p,f)===!1)&&!(p.getX()===i&&p.getY()===n),a)}forRay(e,s,i,n,h){const a=(h==null?void 0:h.connected)??!1,o=(h==null?void 0:h.scale)??1,u=Math.cos(i),p=Math.sin(i),f=Math.abs(u)+Math.abs(p);let M=Math.abs(u/f),C=Math.abs(p/f),S=(1+(M>C?C/M:M/C))*o;M*=S*Math.sign(u),C*=S*Math.sign(p);let I,B,m=0;for(;;){let r=!1;const c=Math.round(e/o)*o;let l=Math.round(s/o)*o;a&&I!==void 0&&Math.round(I/o)*o!==c&&Math.round(B/o)*o!==l&&(l=Math.round(B),r=!0);const g=this.getTile(c,l);if(!g||!n(g,m))break;r||(e+=M,s+=C),I=c,B=l,m++}}forRect(e,s,i,n,h,a){const o=(a==null?void 0:a.scale)??1;e=Math.floor(e/o)*o,s=Math.floor(s/o)*o,i=Math.floor(i/o)*o,n=Math.floor(n/o)*o;const u=(f,M)=>{const C=this.getTile(f,M);C&&h(C)},p=f=>{if(i>e)for(let M=e;M<=i;M+=o)u(M,f);else for(let M=e;M>=i;M-=o)u(M,f)};if(n>s)for(let f=s;f<=n;f+=o)p(f);else for(let f=s;f>=n;f-=o)p(f)}forCircle(e,s,i,n,h){const a=(h==null?void 0:h.edgeOnly)??!1,o=(h==null?void 0:h.scale)??1;e=Math.floor(e/o),s=Math.floor(s/o);let u=i/2;const p=u*u,f=(u-1)*(u-1),M=(C,S,I=0)=>{const B=C+I,m=S+I,r=B*B+m*m;if(r<p&&!(a&&r<f)){const c=this.getTile((e+C)*o,(s+S)*o,a);c&&n(c)}};if(i%2===0)for(let C=-u;C<u;C+=1)for(let S=-u;S<u;S+=1)M(S,C,.5);else{u=u|0;for(let C=-u;C<u+1;C+=1)for(let S=-u;S<u+1;S+=1)M(S,C)}}spawn(e){this.entities.push(e.entity),this.entitiesMap.get(e.category).add(e.entity),e.tick?this.tickingEntities.push(e.entity):this.dirty=!0,e.spawn&&this.initialized&&e.spawn()}spawnStatic(e){this.getEntityTiles(e).forEach(i=>{i.setStaticEntity(e.entity),this.changedTiles.add(i)}),this.addedAgents.add(e),this.spawn(e),this.dirty=!0,q(e)&&E(e)>1&&this.towers.add(e)}despawn(e){const s=this.entities.indexOf(e.entity);s>=0&&(this.entities.splice(s,1),e.tick&&this.tickingEntities.splice(this.tickingEntities.indexOf(e.entity),1));const i=this.entitiesMap.get(e.category).delete(e.entity);return this.deletedEntities.push(e.entity),e.despawn&&e.despawn(),i}despawnStatic(e){this.getEntityTiles(e).forEach(i=>{i.clearStaticEntity(),this.changedTiles.add(i)}),this.removedAgents.add(e),this.despawn(e),this.dirty=!0,q(e)&&this.towers.delete(e)}getEntities(){return this.entities}getTickingEntities(){return this.tickingEntities}getEntitiesForCategory(e){return this.entitiesMap.get(e)}getDeletedEntities(){return this.deletedEntities}getTowers(){return this.towers}getTowerDirection(e){let s=0,i=0;return this.towers.forEach(n=>{s+=n.entity.getX()-e.getX(),i+=n.entity.getY()-e.getY()}),Math.atan2(i,s)}getTiles(){return this.map}markPristine(){this.dirty=!1,this.deletedEntities=[]}forceRerender(){this.dirty=!0}isDirty(){return this.dirty}get version(){return this._version}}var y=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function tt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var K={exports:{}};(function(t,e){(function(){var s,i,n,h,a,o,u,p,f,M,C,S,I,B,m;n=Math.floor,M=Math.min,i=function(r,c){return r<c?-1:r>c?1:0},f=function(r,c,l,g,A){var k;if(l==null&&(l=0),A==null&&(A=i),l<0)throw new Error("lo must be non-negative");for(g==null&&(g=r.length);l<g;)k=n((l+g)/2),A(c,r[k])<0?g=k:l=k+1;return[].splice.apply(r,[l,l-l].concat(c)),c},o=function(r,c,l){return l==null&&(l=i),r.push(c),B(r,0,r.length-1,l)},a=function(r,c){var l,g;return c==null&&(c=i),l=r.pop(),r.length?(g=r[0],r[0]=l,m(r,0,c)):g=l,g},p=function(r,c,l){var g;return l==null&&(l=i),g=r[0],r[0]=c,m(r,0,l),g},u=function(r,c,l){var g;return l==null&&(l=i),r.length&&l(r[0],c)<0&&(g=[r[0],c],c=g[0],r[0]=g[1],m(r,0,l)),c},h=function(r,c){var l,g,A,k,x,F;for(c==null&&(c=i),k=(function(){F=[];for(var W=0,D=n(r.length/2);0<=D?W<D:W>D;0<=D?W++:W--)F.push(W);return F}).apply(this).reverse(),x=[],g=0,A=k.length;g<A;g++)l=k[g],x.push(m(r,l,c));return x},I=function(r,c,l){var g;if(l==null&&(l=i),g=r.indexOf(c),g!==-1)return B(r,0,g,l),m(r,g,l)},C=function(r,c,l){var g,A,k,x,F;if(l==null&&(l=i),A=r.slice(0,c),!A.length)return A;for(h(A,l),F=r.slice(c),k=0,x=F.length;k<x;k++)g=F[k],u(A,g,l);return A.sort(l).reverse()},S=function(r,c,l){var g,A,k,x,F,W,D,_,Y;if(l==null&&(l=i),c*10<=r.length){if(k=r.slice(0,c).sort(l),!k.length)return k;for(A=k[k.length-1],D=r.slice(c),x=0,W=D.length;x<W;x++)g=D[x],l(g,A)<0&&(f(k,g,0,null,l),k.pop(),A=k[k.length-1]);return k}for(h(r,l),Y=[],F=0,_=M(c,r.length);0<=_?F<_:F>_;0<=_?++F:--F)Y.push(a(r,l));return Y},B=function(r,c,l,g){var A,k,x;for(g==null&&(g=i),A=r[l];l>c;){if(x=l-1>>1,k=r[x],g(A,k)<0){r[l]=k,l=x;continue}break}return r[l]=A},m=function(r,c,l){var g,A,k,x,F;for(l==null&&(l=i),A=r.length,F=c,k=r[c],g=2*c+1;g<A;)x=g+1,x<A&&!(l(r[g],r[x])<0)&&(g=x),r[c]=r[g],c=g,g=2*c+1;return r[c]=k,B(r,F,c,l)},s=function(){r.push=o,r.pop=a,r.replace=p,r.pushpop=u,r.heapify=h,r.updateItem=I,r.nlargest=C,r.nsmallest=S;function r(c){this.cmp=c??i,this.nodes=[]}return r.prototype.push=function(c){return o(this.nodes,c,this.cmp)},r.prototype.pop=function(){return a(this.nodes,this.cmp)},r.prototype.peek=function(){return this.nodes[0]},r.prototype.contains=function(c){return this.nodes.indexOf(c)!==-1},r.prototype.replace=function(c){return p(this.nodes,c,this.cmp)},r.prototype.pushpop=function(c){return u(this.nodes,c,this.cmp)},r.prototype.heapify=function(){return h(this.nodes,this.cmp)},r.prototype.updateItem=function(c){return I(this.nodes,c,this.cmp)},r.prototype.clear=function(){return this.nodes=[]},r.prototype.empty=function(){return this.nodes.length===0},r.prototype.size=function(){return this.nodes.length},r.prototype.clone=function(){var c;return c=new r,c.nodes=this.nodes.slice(0),c},r.prototype.toArray=function(){return this.nodes.slice(0)},r.prototype.insert=r.prototype.push,r.prototype.top=r.prototype.peek,r.prototype.front=r.prototype.peek,r.prototype.has=r.prototype.contains,r.prototype.copy=r.prototype.clone,r}(),function(r,c){return t.exports=c()}(this,function(){return s})}).call(y)})(K);var et=K.exports,st=et,it=tt(st);class b{constructor(e,s,i,n,h,a=[]){w(this,"index",0);w(this,"sectionIndex",0);w(this,"tileSet");this.pathfinder=e,this.tiles=s,this.sections=i,this.speed=n,this.costs=h,this.checkpoints=a,this.tileSet=new Set(s)}performStep(e,s){const i=this.index%1,n=this.index|0,h=this.tiles[n],a=this.speed*s/(this.costs[n]??1);let o=this.index+a|0;n===o&&o++,o>=this.tiles.length-1&&(o=this.tiles.length-1);const u=this.tiles[o];for(;this.checkpoints.length>0;){const f=this.checkpoints[0];if(f&&o>=f.index)if(f.isCleared(this.tiles,e))this.checkpoints.shift();else return this.index=f.index-1,{from:this.tiles[this.index],to:u,step:0};else break}const p=this.costs[o]??1;for(this.index=Math.min(this.index+this.speed*s/p,this.tiles.length-1);this.index>this.sections[this.sectionIndex].to;)this.sectionIndex++;return{from:h,to:u,step:i}}getFuturePosition(e){let s=this.index,i=this.sectionIndex;for(;e>0;){const n=this.sections[i],h=n.to-s,a=h/this.speed*n.cost;if(e>a?(s+=h,i++,e-=a):(s+=h*e/a,e=0),s>=this.tiles.length-1)return this.tiles.length-1}return s}fastForward(e){let s=this.checkpoints[0];for(let i=(this.index|0)+1;i<this.tiles.length;i++){if(s&&i>=s.index)if(s.isCleared(this.tiles,e))this.checkpoints.shift(),s=this.checkpoints[0];else break;if(this.getTile(i).isDiscovered())break;this.index=i}}clone(){return new b(this.pathfinder,this.tiles,this.sections,this.speed,this.costs,[...this.checkpoints])}slice(e=0,s=Number.MAX_VALUE){const i=this.tiles.slice(e,s),n=this.costs.slice(e,s),h=b.calculateSections(i,n),a=this.checkpoints.filter(o=>o.index>=e&&o.index<s);return new b(this.pathfinder,i,h,this.speed,n,a)}setIndex(e){this.index=Math.max(Math.min(e,this.tiles.length-1),0),this.sectionIndex=this.sections.findIndex(({from:s,to:i})=>this.index>=s&&this.index<i)}getIndex(){return this.index}getTile(e=this.index){return this.tiles[e|0]}getTiles(){return this.tiles}getLength(){return this.tiles.length}getCoordinates(e=this.index){if(e>=this.tiles.length-1){const h=this.tiles[this.tiles.length-1];return{x:h.getX(),y:h.getY()}}const s=e%1,i=this.tiles[e|0],n=this.tiles[(e|0)+1];return{x:(n.getX()-i.getX())*s+i.getX(),y:(n.getY()-i.getY())*s+i.getY()}}getSpeed(){return this.speed}setSpeed(e){this.speed=e}isDone(){return this.index===this.tiles.length-1}isPaused(e){if(this.isDone())return!0;const s=this.getNextCheckpoint();return s&&s.index===this.index+1&&!s.isCleared(this.tiles,e)}getNextCheckpoint(){return this.checkpoints[0]||null}getCheckpoints(){return this.checkpoints}setCheckpoints(e){this.checkpoints=e}getCurrentTile(){return this.index<0?this.tiles[0]:this.tiles[this.index|0]}getScale(){return this.pathfinder.scale}recompute(){const e=this.pathfinder.getSurface();let s;for(let i=0;i<this.tiles.length;i++){const n=this.tiles[i],h=e.getTile(n.getX(),n.getY());this.tiles[i]=h,this.costs[i]=this.pathfinder.getCost(h,s)??1,s=h,n!==h&&(this.tileSet.delete(n),this.tileSet.add(h))}this.sections=b.calculateSections(this.tiles,this.costs)}isAffectedByTiles(e){for(let s of e)if(this.tileSet.has(s))return!0;return!1}static calculateSections(e,s){return e.reduce((i,n,h)=>{const a=i[i.length-1],o=s[h];return a?(a.cost===o?a.to++:i.push({from:h,to:h+1,cost:o}),i):[{from:h,to:h+1,cost:o}]},[])}static fromTiles(e,s,i=1){const n=new b(e,s,[],i,[]);return n.recompute(),n}static fromMapAndCosts(e,s,i,n,h=1){let a=i;const o=[a];for(;a!==s;)a=n.get(a.getHash()),o.push(a);return this.fromTiles(e,o.reverse(),h)}static fromPaths(e,s){const i=s.map(u=>u.getTiles()),n=s.map(u=>u.getCheckpoints()),h=i[0],a=n[0];for(let u=1;u<i.length;u++){const p=i[u];if(h[h.length-1]!==p[0])throw new Error("Cannot merge paths because they don't start and end at the same point");const f=n[u].filter(M=>M.index!==0);f.forEach(M=>M.index+=h.length),a.push(...f),p.shift(),h.push(...p)}const o=b.fromTiles(e,h,s[0].getSpeed());return o.setCheckpoints(a),o}}const nt={[d.Grass]:3,[d.Water]:20,[d.Stone]:4,[d.Wall]:3,[d.Spore]:2,[d.ElectricFence]:5,[d.Fence]:20,[d.Freezer]:6,[d.Obstructed]:3,[d.Bridge]:5,[d.Dirt]:2.5,[d.Sand]:3.5,[d.Snow]:3.5,[d.Ice]:10,[d.PlayerBuilding]:3,[d.Tree]:5,[d.Rock]:5,[d.Base]:Number.EPSILON},rt={[d.Fence]:5,[d.ElectricFence]:40,[d.Wall]:500,[d.Freezer]:.5,[d.Obstructed]:500,[d.PlayerBuilding]:-10};d.Grass+"",d.Water+"",d.Stone+"",d.Wall+"",d.Spore+"",d.ElectricFence+"",d.Fence+"",d.Freezer+"",d.Obstructed+"",d.Bridge+"",d.Dirt+"",d.Sand+"",d.Snow+"",d.Ice+"",d.PlayerBuilding+"",d.Tree+"",d.Rock+"",d.Base+"",Number.EPSILON,d.Fence+"",d.ElectricFence+"",d.Wall+"",d.Tree+"",d.Rock+"",d.Obstructed+"",d.PlayerBuilding+"";const ht=[[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],ot=150;class ct{constructor(e,s=rt,i=nt,n=1,h=ot){w(this,"neighbors");w(this,"computedCosts");w(this,"computedMultipliers");w(this,"scaledWidth");w(this,"scaledHeight");w(this,"computedVersion",-1);this.surface=e,this.costMultipliers=s,this.costs=i,this.scale=n,this.maxDiagonalCost=h,this.neighbors=ht.map(([a,o])=>[a*n,o*n])}getPath(e,s,i){this.computedVersion!==this.surface.version&&this.computeCosts(),e=this.surface.getTile(Math.floor(e.getX()/this.scale)*this.scale,Math.floor(e.getY()/this.scale)*this.scale),s=this.surface.getTile(Math.floor(s.getX()/this.scale)*this.scale,Math.floor(s.getY()/this.scale)*this.scale);const n=i?S=>i(this.computedMultipliers[this.getIndex(S)],S):S=>this.computedMultipliers[this.getIndex(S)],h=new Set,o=(this.computedCosts[this.getIndex(e)]??1)*n(e),u=new Map;u.set(e.getHash(),o);const p=new Map;p.set(e.getHash(),o);const f=new Map;f.set(e.getHash(),o+this.heuristic(e,s));const M=new it((S,I)=>(f.get(S.getHash())??1/0)-(f.get(I.getHash())??1/0));M.push(e);const C=new Map;for(;!M.empty();){let S=M.pop();if(s===S)return b.fromMapAndCosts(this,e,s,C);const I=S.getHash(),B=this.neighbors.map(([r,c])=>this.surface.getTile(r+S.getX(),c+S.getY())),m=[];this.setCostAndMultiplier(0,m,n,B[0]),this.setCostAndMultiplier(1,m,n,B[1]),this.setCostAndMultiplier(2,m,n,B[2]),this.setCostAndMultiplier(3,m,n,B[3]),this.setDiagonalCostAndMultiplier(4,0,1,m,n,B[4]),this.setDiagonalCostAndMultiplier(5,0,2,m,n,B[5]),this.setDiagonalCostAndMultiplier(6,1,3,m,n,B[6]),this.setDiagonalCostAndMultiplier(7,2,3,m,n,B[7]),B.forEach((r,c)=>{if(!r)return;const l=m[c*2];if(!l||h.has(r))return;const g=r.getHash(),A=p.get(I)+m[c*2+1];if(A<(p.get(g)??1/0)){const k=u.get(I)+l;u.set(g,k),C.set(g,S),p.set(g,A),f.set(g,A+this.heuristic(r,s)),M.push(r),h.add(S)}})}}getHivePath(e,s){const i={},n=(h,a)=>(i[a.getHash()]??1)*h;return e.reduce((h,a,o)=>{const u=this.getPath(a,s,n);return h.push(u),u&&e.length>o-1&&u.getTiles().forEach(p=>{if(p.getType()===d.Fence){i[p.getHash()]=1.2;return}if(p.getType()===d.Obstructed){i[p.getHash()]=.85;return}i[p.getHash()]=i[p.getHash()]+.1||1.1}),h},[])}getWaypointPath(e){const s=[];for(let i=0;i<e.length-1;i++)s.push(this.getPath(e[i],e[i+1]));return b.fromPaths(this,s)}getCost(e,s){this.computedVersion!==this.surface.version&&this.computeCosts();const i=this.computedCosts[this.getIndex(e)];if(!s)return i;const n=this.computedCosts[this.getIndex(s)];if(!i||!n)return null;const h=(i+n)/2;return!i||!n||e.getX()===s.getX()||e.getY()==s.getY()?h:h+(this.computedCosts[(s.getY()/this.scale|0)*this.scaledWidth+(e.getX()/this.scale|0)]+this.computedCosts[(e.getY()/this.scale|0)*this.scaledWidth+(s.getX()/this.scale|0)])/4}getSurface(){return this.surface}heuristic(e,s){return Math.abs(e.getX()-s.getX())+Math.abs(e.getY()-s.getY())}setCostAndMultiplier(e,s,i,n){if(!n)return;const h=this.computedCosts[this.getIndex(n)];h&&(s[e*2]=h,s[e*2+1]=h*i(n))}setDiagonalCostAndMultiplier(e,s,i,n,h,a){if(!a||!n[s*2]||!n[i*2])return;const o=n[s*2+1]+n[i*2+1];if(o>this.maxDiagonalCost)return;const u=this.computedCosts[this.getIndex(a)];u&&(n[e*2]=u+(n[s*2]+n[i*2])/4,n[e*2+1]=u*h(a)+o/4)}computeCosts(){this.computedVersion=this.surface.version;const e=this.scale**2;this.scaledWidth=Math.floor(this.surface.getWidth()/this.scale),this.scaledHeight=Math.floor(this.surface.getHeight()/this.scale);const s=this.scaledWidth*this.scaledHeight;this.computedCosts=new Array(s),this.computedMultipliers=new Array(s);for(let i=0;i<this.scaledWidth;i++)for(let n=0;n<this.scaledHeight;n++){const h=this.surface.getEntityTiles(i*this.scale,n*this.scale,this.scale);let a=0,o=0;for(let p=0;p<h.length;p++){let f=h[p].getType();if(!this.costs[f]){a=null,o=e;break}a+=this.costs[f],o+=this.costMultipliers[f]??1}const u=n*this.scaledWidth+i;this.computedCosts[u]=a===null?null:a/e,this.computedMultipliers[u]=o/e}}getIndex(e){return(e.getY()/this.scale|0)*this.scaledWidth+(e.getX()/this.scale|0)}}onmessage=({data:{buffer:t,costMultiplier:e,costs:s,scale:i,maxDiagonalCost:n,startPoints:h,target:a}})=>{const o=new T(new P(new Uint8Array(t))),u=new ct(o,e,s,i,n),p=h.map(({x:S,y:I})=>o.getTile(S,I)),f=o.getTile(a.x,a.y),C=u.getHivePath(p,f).filter(S=>!!S).map(S=>S.getTiles().map(I=>I.serialize()));postMessage(C)}})();
