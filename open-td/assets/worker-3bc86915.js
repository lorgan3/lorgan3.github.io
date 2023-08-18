var lt=Object.defineProperty;var at=(P,R,L)=>R in P?lt(P,R,{enumerable:!0,configurable:!0,writable:!0,value:L}):P[R]=L;var S=(P,R,L)=>(at(P,typeof R!="symbol"?R+"":R,L),L);(function(){"use strict";const P=t=>t.constructor.scale;function R(t){return t?"getTile"in t:!1}var L=(t=>(t[t.Unknown=0]="Unknown",t[t.Player=1]="Player",t[t.Enemy=2]="Enemy",t))(L||{}),v=(t=>(t[t.None=0]="None",t[t.Tower=1]="Tower",t[t.Slime=2]="Slime",t[t.Base=3]="Base",t[t.Bullet=4]="Bullet",t[t.Wall=5]="Wall",t[t.Mortar=6]="Mortar",t[t.Flamethrower=7]="Flamethrower",t[t.Flame=8]="Flame",t[t.Railgun=9]="Railgun",t[t.Rail=10]="Rail",t[t.ElectricFence=11]="ElectricFence",t[t.Fence=12]="Fence",t[t.Freezer=13]="Freezer",t[t.Tree=14]="Tree",t[t.Pine=15]="Pine",t[t.Cactus=16]="Cactus",t[t.Stump=17]="Stump",t[t.Rock=18]="Rock",t[t.Rock2=19]="Rock2",t[t.Rock3=20]="Rock3",t[t.Radar=21]="Radar",t[t.PowerPlant=22]="PowerPlant",t[t.Blueprint=23]="Blueprint",t[t.Shockwave=24]="Shockwave",t[t.Armory=25]="Armory",t[t.Market=26]="Market",t[t.SpeedBeacon=27]="SpeedBeacon",t[t.Runner=28]="Runner",t[t.DamageBeacon=29]="DamageBeacon",t[t.Laser=30]="Laser",t[t.LaserBeam=31]="LaserBeam",t[t.Flier=32]="Flier",t[t.Tank=33]="Tank",t[t.Rocket=34]="Rocket",t[t.WavePoint=35]="WavePoint",t[t.Barracks=36]="Barracks",t[t.Tesla=37]="Tesla",t[t.Spark=38]="Spark",t[t.Behemoth=39]="Behemoth",t[t.Bore=40]="Bore",t[t.Excavator=41]="Excavator",t[t.Convert=42]="Convert",t[t.Terraform=43]="Terraform",t[t.EmergencyRecharge=44]="EmergencyRecharge",t[t.EmergencyRepair=45]="EmergencyRepair",t))(v||{});[...new Set([3,21,22,25,26,36])];var N=(t=>(t[t.Undiscovered=0]="Undiscovered",t[t.Pending=1]="Pending",t[t.Discovered=2]="Discovered",t))(N||{}),d=(t=>(t[t.Void=0]="Void",t[t.Grass=1]="Grass",t[t.Stone=2]="Stone",t[t.Water=3]="Water",t[t.Obstructed=4]="Obstructed",t[t.Wall=5]="Wall",t[t.Spore=6]="Spore",t[t.ElectricFence=7]="ElectricFence",t[t.Fence=8]="Fence",t[t.Freezer=9]="Freezer",t[t.Bridge=10]="Bridge",t[t.Dirt=11]="Dirt",t[t.Snow=12]="Snow",t[t.Sand=13]="Sand",t[t.Ice=14]="Ice",t[t.PlayerBuilding=15]="PlayerBuilding",t[t.Tree=16]="Tree",t[t.Rock=17]="Rock",t[t.Base=18]="Base",t))(d||{}),U=(t=>(t[t.WaterAlt=19]="WaterAlt",t[t.WaterStill=20]="WaterStill",t[t.GrassFlower=21]="GrassFlower",t[t.GrassAlt=22]="GrassAlt",t[t.GrassPlain=23]="GrassPlain",t[t.SandAlt=24]="SandAlt",t[t.SnowAlt=25]="SnowAlt",t[t.IceAlt=26]="IceAlt",t[t.Static1=27]="Static1",t[t.Static2=28]="Static2",t[t.Static3=29]="Static3",t))(U||{});const J={19:3,20:3,21:1,22:1,23:1,24:13,25:12,26:14,27:0,28:0,29:0},Q=new Set([1,2,11,13,12]);[...new Set([...Q,3,14,10,16,17])];const Z={[v.Tower]:4,[v.Wall]:5,[v.Mortar]:4,[v.Flamethrower]:4,[v.Railgun]:4,[v.ElectricFence]:7,[v.Fence]:8,[v.Freezer]:9,[v.Radar]:18,[v.PowerPlant]:18,[v.Tree]:16,[v.Rock]:17,[v.Armory]:18,[v.Base]:18,[v.Market]:18,[v.SpeedBeacon]:4,[v.DamageBeacon]:4,[v.Laser]:4,[v.Barracks]:18,[v.Tesla]:4};class V{constructor(e,s,i=d.Void){S(this,"staticEntity",null);S(this,"hash");S(this,"actualType");S(this,"type");S(this,"towers",[]);S(this,"linkedAgents");S(this,"discoveryStatus",N.Undiscovered);this.x=e,this.y=s,this.altType=i,this.hash=`[${this.x}, ${this.y}]`,this.type=J[i]??i,this.actualType=this.type}serialize(){return{x:this.x,y:this.y,type:this.type}}getX(){return this.x}getY(){return this.y}getBaseType(){return this.type}getAltType(){return this.altType}getAnimation(){return this.type===d.Water?[d.Water,U.WaterAlt,U.WaterStill]:[this.altType]}getType(){return this.actualType}getStaticEntity(){return this.staticEntity}hasStaticEntity(){return this.staticEntity!==null}setStaticEntity(e){if(e===this.staticEntity)return;if(this.staticEntity!==null)throw new Error("A tile can only have 1 static entity.");const s=e.getAgent();R(s)&&s.getTile().getHash()===this.getHash()&&(s.updateTile(this),this.linkedAgents&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)),this.staticEntity=e,this.actualType=Z[e.getAgent().getType()]||this.type}clearStaticEntity(){this.staticEntity=null,this.actualType=this.type}isStaticEntityRoot(){var e;return((e=this.staticEntity)==null?void 0:e.getAgent().getTile())===this}addTower(e){this.towers.includes(e)||this.towers.push(e)}setDiscoveryStatus(e){this.discoveryStatus=e}isDiscovered(){return this.discoveryStatus===N.Discovered}getDiscoveryStatus(){return this.discoveryStatus}isCoveredByTower(){return this.isDiscovered()&&this.towers.length>0}removeTower(e){this.towers.splice(this.towers.indexOf(e),1)}getAvailableTowers(){return this.towers.filter(e=>e.getCooldown()<=0)}getTowers(){return this.towers}addLinkedAgent(e){var i;this.linkedAgents||(this.linkedAgents=new Set),this.linkedAgents.add(e);const s=(i=this.staticEntity)==null?void 0:i.getAgent();s&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)}removeLinkedAgent(e){var i;if(!this.linkedAgents)return;this.linkedAgents.delete(e);const s=(i=this.staticEntity)==null?void 0:i.getAgent();R(s)&&s.updateLinkedAgents&&s.updateLinkedAgents(this.linkedAgents)}getLinkedAgents(){return this.linkedAgents}getHash(){return this.hash}sync(e){this.towers=e.towers,this.discoveryStatus=e.discoveryStatus}}var j=(t=>(t[t.StatUpdate=0]="StatUpdate",t[t.SurfaceChange=1]="SurfaceChange",t[t.BlackOut=2]="BlackOut",t[t.OpenBuildMenu=3]="OpenBuildMenu",t[t.CloseBuildMenu=4]="CloseBuildMenu",t[t.SelectPlaceable=5]="SelectPlaceable",t[t.ToggleShowCoverage=6]="ToggleShowCoverage",t[t.StartWave=7]="StartWave",t[t.EndWave=8]="EndWave",t[t.Unlock=9]="Unlock",t[t.Discover=10]="Discover",t[t.Spawn=11]="Spawn",t[t.Buy=12]="Buy",t[t.Sell=13]="Sell",t[t.HitBase=14]="HitBase",t[t.Lose=15]="Lose",t[t.Kill=16]="Kill",t[t.Pierce=17]="Pierce",t[t.Bomb=18]="Bomb",t[t.Stun=19]="Stun",t))(j||{});const z=class z{constructor(){S(this,"eventHandlers");z.instance=this,this.eventHandlers=new Map}addEventListener(e,s){return this.eventHandlers.has(e)?this.eventHandlers.get(e).add(s):this.eventHandlers.set(e,new Set([s])),()=>this.removeEventListener(e,s)}addEventListeners(e,s){const i=e.map(n=>this.addEventListener(n,s));return()=>i.forEach(n=>n())}removeEventListener(e,s){var i;(i=this.eventHandlers.get(e))==null||i.delete(s)}triggerEvent(e,...s){var i;(i=this.eventHandlers.get(e))==null||i.forEach(n=>n(...s))}static get Instance(){return this.instance}};S(z,"instance");let X=z;function q(t){return"getCooldown"in t}const E=t=>t.constructor.range,$=[[1,0],[-1,0],[0,1],[0,-1]],G=[...$,[1,1],[-1,-1],[-1,1],[1,-1]],O=class O{constructor(e,s){S(this,"tileBufferSize");this.buffer=e,this.staticEntityConstructor=s,this.tileBufferSize=this.withEntities?2:1}get width(){return this.buffer[0]}get height(){return this.buffer[1]}get withEntities(){return this.buffer[2]}getTile(e){const s=O.propertyCount+e*this.tileBufferSize,i=new V(e%this.width,Math.floor(e/this.width),this.buffer[s]);if(this.withEntities&&this.staticEntityConstructor){const n=this.staticEntityConstructor(this.buffer[s+1],i);n&&i.setStaticEntity(n)}return i}static serializeSurface(e,s){const i=s?2:1,n=new Uint8Array(O.propertyCount+e.map.length*i);n[0]=e.getWidth(),n[1]=e.getHeight(),n[2]=s?1:0;for(let h=0;h<e.map.length;h++){const l=e.map[h],o=h*i+O.propertyCount;if(n[o]=s?l.getAltType():l.getType(),s){const u=l.hasStaticEntity()&&l.getStaticEntity().getAgent().getTile()===l?l.getStaticEntity().getAgent():null;n[o+1]=(u==null?void 0:u.getType())??v.None}}return n}};S(O,"propertyCount",3);let D=O;class T{constructor(e){S(this,"map");S(this,"entities",[]);S(this,"deletedEntities",[]);S(this,"tickingEntities",[]);S(this,"entitiesMap",new Map);S(this,"towers",new Set);S(this,"width");S(this,"height");S(this,"dirty",!1);S(this,"_version",0);S(this,"changedTiles",new Set);S(this,"addedAgents",new Set);S(this,"removedAgents",new Set);S(this,"initialized",!1);this.width=e.width,this.height=e.height;const s=e instanceof D?e:e.generate;this.initialize(s??((i,n)=>new V(i,n))),this.initialized=!0}serialize(e){return new D(D.serializeSurface(this,e))}initialize(e){this.entities=[],this.deletedEntities=[],this.entitiesMap.clear(),Object.values(L).filter(i=>typeof i!="string").forEach(i=>this.entitiesMap.set(i,new Set)),this.map=new Array(this.width*this.height);const s=[];if(e instanceof D)for(let i=0;i<this.map.length;i++){const n=e.getTile(i);this.map[i]=n,n.hasStaticEntity()&&s.push(n.getStaticEntity())}else for(let i=0;i<this.height;i++)for(let n=0;n<this.width;n++){const h=e(n,i);this.map[i*this.width+n]=h,h.hasStaticEntity()&&s.push(h.getStaticEntity())}for(let i of s)this.spawnStatic(i.getAgent())}getTile(e,s,i=!1){return e>=this.width||e<0||s>=this.height||s<0?i?this.getTile(Math.max(Math.min(e,this.width-1),0),Math.max(Math.min(s,this.height-1),0)):void 0:this.map[s*this.width+e]}getEntityTiles(e,s,i){let n;if(s!==void 0)n=e;else{const h=e;n=h.getTile().getX(),s=h.getTile().getY(),i=P(h)}switch(i){case 1:return[this.map[s*this.width+n]];case 2:return[this.map[s*this.width+n],this.map[s*this.width+n+1],this.map[(s+1)*this.width+n],this.map[(s+1)*this.width+n+1]];default:throw new Error("Unsupported agent scale!")}}getAdjacentTiles(e,s=1,i=!1){return(i?G:$).map(([n,h])=>this.getTile(e.getX()+n*s,e.getY()+h*s)).filter(n=>!!n)}setTile(e){this.setTileInternal(e)}setTiles(e){e.map(s=>this.setTileInternal(s))}setTileInternal(e){this.dirty=!0,this._version++;const s=this.map[e.getY()*this.width+e.getX()];return s.hasStaticEntity()&&!e.hasStaticEntity()?e.setStaticEntity(s.getStaticEntity()):s.hasStaticEntity()&&this.despawnStatic(s.getStaticEntity().getAgent()),e.sync(s),this.map[e.getY()*this.width+e.getX()]=e,this.changedTiles.add(s),s}processChangedTiles(){this.changedTiles.size&&(X.Instance.triggerEvent(j.SurfaceChange,{affectedTiles:this.changedTiles,addedStaticAgents:this.addedAgents,removedStaticAgents:this.removedAgents}),this.changedTiles.clear(),this.addedAgents.clear(),this.removedAgents.clear())}getRow(e){const s=e*this.width;return this.map.slice(s,s+this.width)}getColumn(e){const s=new Array(this.height);for(let i=0;i<this.height;i++)s[i]=this.getTile(e,i);return s}getWidth(){return this.width}getHeight(){return this.height}forLine(e,s,i,n,h,l){const o=(l==null?void 0:l.scale)??1;e=Math.floor(e/o)*o,s=Math.floor(s/o)*o,i=Math.floor(i/o)*o,n=Math.floor(n/o)*o;const u=Math.atan2(n-s,i-e);return this.forRay(e,s,u,(f,p)=>!(h(f,p)===!1)&&!(f.getX()===i&&f.getY()===n),l)}forRay(e,s,i,n,h){const l=(h==null?void 0:h.connected)??!1,o=(h==null?void 0:h.scale)??1,u=Math.cos(i),f=Math.sin(i),p=Math.abs(u)+Math.abs(f);let k=Math.abs(u/p),A=Math.abs(f/p),w=(1+(k>A?A/k:k/A))*o;k*=w*Math.sign(u),A*=w*Math.sign(f);let F,B,m=0;for(;;){let r=!1;const c=Math.round(e/o)*o;let a=Math.round(s/o)*o;l&&F!==void 0&&Math.round(F/o)*o!==c&&Math.round(B/o)*o!==a&&(a=Math.round(B),r=!0);const g=this.getTile(c,a);if(!g||!n(g,m))break;r||(e+=k,s+=A),F=c,B=a,m++}}forRect(e,s,i,n,h,l){const o=(l==null?void 0:l.scale)??1;e=Math.floor(e/o)*o,s=Math.floor(s/o)*o,i=Math.floor(i/o)*o,n=Math.floor(n/o)*o;const u=(p,k)=>{const A=this.getTile(p,k);A&&h(A)},f=p=>{if(i>e)for(let k=e;k<=i;k+=o)u(k,p);else for(let k=e;k>=i;k-=o)u(k,p)};if(n>s)for(let p=s;p<=n;p+=o)f(p);else for(let p=s;p>=n;p-=o)f(p)}forCircle(e,s,i,n,h){const l=(h==null?void 0:h.edgeOnly)??!1,o=(h==null?void 0:h.scale)??1;e=Math.floor(e/o),s=Math.floor(s/o);let u=i/2;const f=u*u,p=(u-1)*(u-1),k=(A,w,F=0)=>{const B=A+F,m=w+F,r=B*B+m*m;if(r<f&&!(l&&r<p)){const c=this.getTile((e+A)*o,(s+w)*o,l);c&&n(c)}};if(i%2===0)for(let A=-u;A<u;A+=1)for(let w=-u;w<u;w+=1)k(w,A,.5);else{u=u|0;for(let A=-u;A<u+1;A+=1)for(let w=-u;w<u+1;w+=1)k(w,A)}}spawn(e){this.entities.push(e.entity),this.entitiesMap.get(e.category).add(e.entity),e.tick?this.tickingEntities.push(e.entity):this.dirty=!0,e.spawn&&this.initialized&&e.spawn()}spawnStatic(e){this.getEntityTiles(e).forEach(i=>{i.setStaticEntity(e.entity),this.changedTiles.add(i)}),this.addedAgents.add(e),this.spawn(e),this.dirty=!0,q(e)&&E(e)>1&&this.towers.add(e)}despawn(e){const s=this.entities.indexOf(e.entity);s>=0&&(this.entities.splice(s,1),e.tick&&this.tickingEntities.splice(this.tickingEntities.indexOf(e.entity),1));const i=this.entitiesMap.get(e.category).delete(e.entity);return this.deletedEntities.push(e.entity),e.despawn&&e.despawn(),i}despawnStatic(e){this.getEntityTiles(e).forEach(i=>{i.clearStaticEntity(),this.changedTiles.add(i)}),this.removedAgents.add(e),this.despawn(e),this.dirty=!0,q(e)&&this.towers.delete(e)}getEntities(){return this.entities}getTickingEntities(){return this.tickingEntities}getEntitiesForCategory(e){return this.entitiesMap.get(e)}getDeletedEntities(){return this.deletedEntities}getTowers(){return this.towers}getTiles(){return this.map}markPristine(){this.dirty=!1,this.deletedEntities=[]}forceRerender(){this.dirty=!0}isDirty(){return this.dirty}get version(){return this._version}}var y=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function tt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var K={exports:{}};(function(t,e){(function(){var s,i,n,h,l,o,u,f,p,k,A,w,F,B,m;n=Math.floor,k=Math.min,i=function(r,c){return r<c?-1:r>c?1:0},p=function(r,c,a,g,C){var M;if(a==null&&(a=0),C==null&&(C=i),a<0)throw new Error("lo must be non-negative");for(g==null&&(g=r.length);a<g;)M=n((a+g)/2),C(c,r[M])<0?g=M:a=M+1;return[].splice.apply(r,[a,a-a].concat(c)),c},o=function(r,c,a){return a==null&&(a=i),r.push(c),B(r,0,r.length-1,a)},l=function(r,c){var a,g;return c==null&&(c=i),a=r.pop(),r.length?(g=r[0],r[0]=a,m(r,0,c)):g=a,g},f=function(r,c,a){var g;return a==null&&(a=i),g=r[0],r[0]=c,m(r,0,a),g},u=function(r,c,a){var g;return a==null&&(a=i),r.length&&a(r[0],c)<0&&(g=[r[0],c],c=g[0],r[0]=g[1],m(r,0,a)),c},h=function(r,c){var a,g,C,M,I,x;for(c==null&&(c=i),M=(function(){x=[];for(var W=0,H=n(r.length/2);0<=H?W<H:W>H;0<=H?W++:W--)x.push(W);return x}).apply(this).reverse(),I=[],g=0,C=M.length;g<C;g++)a=M[g],I.push(m(r,a,c));return I},F=function(r,c,a){var g;if(a==null&&(a=i),g=r.indexOf(c),g!==-1)return B(r,0,g,a),m(r,g,a)},A=function(r,c,a){var g,C,M,I,x;if(a==null&&(a=i),C=r.slice(0,c),!C.length)return C;for(h(C,a),x=r.slice(c),M=0,I=x.length;M<I;M++)g=x[M],u(C,g,a);return C.sort(a).reverse()},w=function(r,c,a){var g,C,M,I,x,W,H,_,Y;if(a==null&&(a=i),c*10<=r.length){if(M=r.slice(0,c).sort(a),!M.length)return M;for(C=M[M.length-1],H=r.slice(c),I=0,W=H.length;I<W;I++)g=H[I],a(g,C)<0&&(p(M,g,0,null,a),M.pop(),C=M[M.length-1]);return M}for(h(r,a),Y=[],x=0,_=k(c,r.length);0<=_?x<_:x>_;0<=_?++x:--x)Y.push(l(r,a));return Y},B=function(r,c,a,g){var C,M,I;for(g==null&&(g=i),C=r[a];a>c;){if(I=a-1>>1,M=r[I],g(C,M)<0){r[a]=M,a=I;continue}break}return r[a]=C},m=function(r,c,a){var g,C,M,I,x;for(a==null&&(a=i),C=r.length,x=c,M=r[c],g=2*c+1;g<C;)I=g+1,I<C&&!(a(r[g],r[I])<0)&&(g=I),r[c]=r[g],c=g,g=2*c+1;return r[c]=M,B(r,x,c,a)},s=function(){r.push=o,r.pop=l,r.replace=f,r.pushpop=u,r.heapify=h,r.updateItem=F,r.nlargest=A,r.nsmallest=w;function r(c){this.cmp=c??i,this.nodes=[]}return r.prototype.push=function(c){return o(this.nodes,c,this.cmp)},r.prototype.pop=function(){return l(this.nodes,this.cmp)},r.prototype.peek=function(){return this.nodes[0]},r.prototype.contains=function(c){return this.nodes.indexOf(c)!==-1},r.prototype.replace=function(c){return f(this.nodes,c,this.cmp)},r.prototype.pushpop=function(c){return u(this.nodes,c,this.cmp)},r.prototype.heapify=function(){return h(this.nodes,this.cmp)},r.prototype.updateItem=function(c){return F(this.nodes,c,this.cmp)},r.prototype.clear=function(){return this.nodes=[]},r.prototype.empty=function(){return this.nodes.length===0},r.prototype.size=function(){return this.nodes.length},r.prototype.clone=function(){var c;return c=new r,c.nodes=this.nodes.slice(0),c},r.prototype.toArray=function(){return this.nodes.slice(0)},r.prototype.insert=r.prototype.push,r.prototype.top=r.prototype.peek,r.prototype.front=r.prototype.peek,r.prototype.has=r.prototype.contains,r.prototype.copy=r.prototype.clone,r}(),function(r,c){return t.exports=c()}(this,function(){return s})}).call(y)})(K);var et=K.exports,st=et,it=tt(st);class b{constructor(e,s,i,n,h,l=[]){S(this,"index",0);S(this,"sectionIndex",0);S(this,"tileSet");this.pathfinder=e,this.tiles=s,this.sections=i,this.speed=n,this.costs=h,this.checkpoints=l,this.tileSet=new Set(s)}performStep(e,s){const i=this.index%1,n=this.index|0,h=this.tiles[n],l=this.speed*s/(this.costs[n]??1);let o=this.index+l|0;n===o&&o++,o>=this.tiles.length-1&&(o=this.tiles.length-1);const u=this.tiles[o];for(;this.checkpoints.length>0;){const p=this.checkpoints[0];if(p&&o>=p.index)if(p.isCleared(this.tiles,e))this.checkpoints.shift();else return this.index=p.index-1,{from:this.tiles[this.index],to:u,step:0};else break}const f=this.costs[o]??1;for(this.index=Math.min(this.index+this.speed*s/f,this.tiles.length-1);this.index>this.sections[this.sectionIndex].to;)this.sectionIndex++;return{from:h,to:u,step:i}}getFuturePosition(e){let s=this.index,i=this.sectionIndex;for(;e>0;){const n=this.sections[i],h=n.to-s,l=h/this.speed*n.cost;if(e>l?(s+=h,i++,e-=l):(s+=h*e/l,e=0),s>=this.tiles.length-1)return this.tiles.length-1}return s}fastForward(e){let s=this.checkpoints[0];for(let i=(this.index|0)+1;i<this.tiles.length;i++){if(s&&i>=s.index)if(s.isCleared(this.tiles,e))this.checkpoints.shift(),s=this.checkpoints[0];else break;if(this.getTile(i).isDiscovered())break;this.index=i}}clone(){return new b(this.pathfinder,this.tiles,this.sections,this.speed,this.costs,[...this.checkpoints])}slice(e=0,s=Number.MAX_VALUE){const i=this.tiles.slice(e,s),n=this.costs.slice(e,s),h=b.calculateSections(i,n),l=this.checkpoints.filter(o=>o.index>=e&&o.index<s);return new b(this.pathfinder,i,h,this.speed,n,l)}setIndex(e){this.index=Math.max(Math.min(e,this.tiles.length-1),0),this.sectionIndex=this.sections.findIndex(({from:s,to:i})=>this.index>=s&&this.index<i)}getIndex(){return this.index}getTile(e=this.index){return this.tiles[e|0]}getTiles(){return this.tiles}getLength(){return this.tiles.length}getCoordinates(e=this.index){if(e>=this.tiles.length-1){const h=this.tiles[this.tiles.length-1];return{x:h.getX(),y:h.getY()}}const s=e%1,i=this.tiles[e|0],n=this.tiles[(e|0)+1];return{x:(n.getX()-i.getX())*s+i.getX(),y:(n.getY()-i.getY())*s+i.getY()}}getSpeed(){return this.speed}setSpeed(e){this.speed=e}isDone(){return this.index===this.tiles.length-1}isPaused(e){if(this.isDone())return!0;const s=this.getNextCheckpoint();return s&&s.index===this.index+1&&!s.isCleared(this.tiles,e)}getNextCheckpoint(){return this.checkpoints[0]||null}getCheckpoints(){return this.checkpoints}setCheckpoints(e){this.checkpoints=e}getCurrentTile(){return this.index<0?this.tiles[0]:this.tiles[this.index|0]}getScale(){return this.pathfinder.scale}recompute(){const e=this.pathfinder.getSurface();let s;for(let i=0;i<this.tiles.length;i++){const n=this.tiles[i],h=e.getTile(n.getX(),n.getY());this.tiles[i]=h,this.costs[i]=this.pathfinder.getCost(h,s)??1,s=h,n!==h&&(this.tileSet.delete(n),this.tileSet.add(h))}this.sections=b.calculateSections(this.tiles,this.costs)}isAffectedByTiles(e){for(let s of e)if(this.tileSet.has(s))return!0;return!1}static calculateSections(e,s){return e.reduce((i,n,h)=>{const l=i[i.length-1],o=s[h];return l?(l.cost===o?l.to++:i.push({from:h,to:h+1,cost:o}),i):[{from:h,to:h+1,cost:o}]},[])}static fromTiles(e,s,i=1){const n=new b(e,s,[],i,[]);return n.recompute(),n}static fromMapAndCosts(e,s,i,n,h=1){let l=i;const o=[l];for(;l!==s;)l=n.get(l.getHash()),o.push(l);return this.fromTiles(e,o.reverse(),h)}static fromPaths(e,s){const i=s.map(u=>u.getTiles()),n=s.map(u=>u.getCheckpoints()),h=i[0],l=n[0];for(let u=1;u<i.length;u++){const f=i[u];if(h[h.length-1]!==f[0])throw new Error("Cannot merge paths because they don't start and end at the same point");const p=n[u].filter(k=>k.index!==0);p.forEach(k=>k.index+=h.length),l.push(...p),f.shift(),h.push(...f)}const o=b.fromTiles(e,h,s[0].getSpeed());return o.setCheckpoints(l),o}}const nt={[d.Grass]:3,[d.Water]:20,[d.Stone]:4,[d.Wall]:3,[d.Spore]:2,[d.ElectricFence]:5,[d.Fence]:20,[d.Freezer]:6,[d.Obstructed]:3,[d.Bridge]:5,[d.Dirt]:2.5,[d.Sand]:3.5,[d.Snow]:3.5,[d.Ice]:10,[d.PlayerBuilding]:3,[d.Tree]:5,[d.Rock]:5,[d.Base]:Number.EPSILON},rt={[d.Fence]:5,[d.ElectricFence]:40,[d.Wall]:500,[d.Freezer]:.5,[d.Obstructed]:500,[d.PlayerBuilding]:-10};d.Grass+"",d.Water+"",d.Stone+"",d.Wall+"",d.Spore+"",d.ElectricFence+"",d.Fence+"",d.Freezer+"",d.Obstructed+"",d.Bridge+"",d.Dirt+"",d.Sand+"",d.Snow+"",d.Ice+"",d.PlayerBuilding+"",d.Tree+"",d.Rock+"",d.Base+"",Number.EPSILON,d.Fence+"",d.ElectricFence+"",d.Wall+"",d.Tree+"",d.Rock+"",d.Obstructed+"",d.PlayerBuilding+"";const ht=[[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],ot=150;class ct{constructor(e,s=rt,i=nt,n=1){S(this,"neighbors");S(this,"computedCosts");S(this,"computedMultipliers");S(this,"scaledWidth");S(this,"scaledHeight");S(this,"computedVersion",-1);this.surface=e,this.costMultipliers=s,this.costs=i,this.scale=n,this.neighbors=ht.map(([h,l])=>[h*n,l*n])}getPath(e,s,i){this.computedVersion!==this.surface.version&&this.computeCosts(),e=this.surface.getTile(Math.floor(e.getX()/this.scale)*this.scale,Math.floor(e.getY()/this.scale)*this.scale),s=this.surface.getTile(Math.floor(s.getX()/this.scale)*this.scale,Math.floor(s.getY()/this.scale)*this.scale);const n=i?w=>i(this.computedMultipliers[this.getIndex(w)],w):w=>this.computedMultipliers[this.getIndex(w)],h=new Set,o=(this.computedCosts[this.getIndex(e)]??1)*n(e),u=new Map;u.set(e.getHash(),o);const f=new Map;f.set(e.getHash(),o);const p=new Map;p.set(e.getHash(),o+this.heuristic(e,s));const k=new it((w,F)=>(p.get(w.getHash())??1/0)-(p.get(F.getHash())??1/0));k.push(e);const A=new Map;for(;!k.empty();){let w=k.pop();if(s===w)return b.fromMapAndCosts(this,e,s,A);const F=w.getHash(),B=this.neighbors.map(([r,c])=>this.surface.getTile(r+w.getX(),c+w.getY())),m=[];this.setCostAndMultiplier(0,m,n,B[0]),this.setCostAndMultiplier(1,m,n,B[1]),this.setCostAndMultiplier(2,m,n,B[2]),this.setCostAndMultiplier(3,m,n,B[3]),this.setDiagonalCostAndMultiplier(4,0,1,m,n,B[4]),this.setDiagonalCostAndMultiplier(5,0,2,m,n,B[5]),this.setDiagonalCostAndMultiplier(6,1,3,m,n,B[6]),this.setDiagonalCostAndMultiplier(7,2,3,m,n,B[7]),B.forEach((r,c)=>{if(!r)return;const a=m[c*2];if(!a||h.has(r))return;const g=r.getHash(),C=f.get(F)+m[c*2+1];if(C<(f.get(g)??1/0)){const M=u.get(F)+a;u.set(g,M),A.set(g,w),f.set(g,C),p.set(g,C+this.heuristic(r,s)),k.push(r),h.add(w)}})}}getHivePath(e,s){const i={},n=(h,l)=>(i[l.getHash()]??1)*h;return e.reduce((h,l,o)=>{const u=this.getPath(l,s,n);return h.push(u),u&&e.length>o-1&&u.getTiles().forEach(f=>{if(f.getType()===d.Fence){i[f.getHash()]=1.2;return}if(f.getType()===d.Obstructed){i[f.getHash()]=.85;return}i[f.getHash()]=i[f.getHash()]+.1||1.1}),h},[])}getWaypointPath(e){const s=[];for(let i=0;i<e.length-1;i++)s.push(this.getPath(e[i],e[i+1]));return b.fromPaths(this,s)}getCost(e,s){this.computedVersion!==this.surface.version&&this.computeCosts();const i=this.computedCosts[this.getIndex(e)];if(!s)return i;const n=this.computedCosts[this.getIndex(s)];if(!i||!n)return null;const h=(i+n)/2;return!i||!n||e.getX()===s.getX()||e.getY()==s.getY()?h:h+(this.computedCosts[(s.getY()/this.scale|0)*this.scaledWidth+(e.getX()/this.scale|0)]+this.computedCosts[(e.getY()/this.scale|0)*this.scaledWidth+(s.getX()/this.scale|0)])/4}getSurface(){return this.surface}heuristic(e,s){return Math.abs(e.getX()-s.getX())+Math.abs(e.getY()-s.getY())}setCostAndMultiplier(e,s,i,n){if(!n)return;const h=this.computedCosts[this.getIndex(n)];h&&(s[e*2]=h,s[e*2+1]=h*i(n))}setDiagonalCostAndMultiplier(e,s,i,n,h,l){if(!l||!n[s*2]||!n[i*2])return;const o=n[s*2+1]+n[i*2+1];if(o>ot)return;const u=this.computedCosts[this.getIndex(l)];u&&(n[e*2]=u+(n[s*2]+n[i*2])/4,n[e*2+1]=u*h(l)+o/4)}computeCosts(){this.computedVersion=this.surface.version;const e=this.scale**2;this.scaledWidth=Math.floor(this.surface.getWidth()/this.scale),this.scaledHeight=Math.floor(this.surface.getHeight()/this.scale);const s=this.scaledWidth*this.scaledHeight;this.computedCosts=new Array(s),this.computedMultipliers=new Array(s);for(let i=0;i<this.scaledWidth;i++)for(let n=0;n<this.scaledHeight;n++){const h=this.surface.getEntityTiles(i*this.scale,n*this.scale,this.scale);let l=0,o=0;for(let f=0;f<h.length;f++){let p=h[f].getType();if(!this.costs[p]){l=null,o=e;break}l+=this.costs[p],o+=this.costMultipliers[p]??1}const u=n*this.scaledWidth+i;this.computedCosts[u]=l===null?null:l/e,this.computedMultipliers[u]=o/e}}getIndex(e){return(e.getY()/this.scale|0)*this.scaledWidth+(e.getX()/this.scale|0)}}onmessage=({data:{buffer:t,costMultiplier:e,costs:s,scale:i,startPoints:n,target:h}})=>{const l=new T(new D(new Uint8Array(t))),o=new ct(l,e,s,i),u=n.map(({x:A,y:w})=>l.getTile(A,w)),f=l.getTile(h.x,h.y),k=o.getHivePath(u,f).filter(A=>!!A).map(A=>A.getTiles().map(w=>w.serialize()));postMessage(k)}})();
