var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();const o=i(s());class n extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("background","assets/images/background/background.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json")}create(){this.scene.start("GameScene")}}const h=[{label:"orange",color:16081665},{label:"yellow",color:16109829},{label:"cyan",color:63127},{label:"light-blue",color:10150133},{label:"purple",color:9269719},{label:"pink",color:15626403}];function r(){const t=Math.floor(Math.random()*h.length);return{label:h[t].label,color:h[t].color}}class l extends o.GameObjects.Sprite{constructor(t,s,i,o,n="static",h="bubbles",r){super(t,s,i,h,r.label),e(this,"_bubbleType"),e(this,"_color"),e(this,"_diameter"),e(this,"neighbors"),this._bubbleType=n,this._color=r,this._diameter=o,this.neighbors=new Set,this.scene.add.existing(this),this.setBubbleSize(),this.initPhysics()}get color(){return this._color}get bubbleType(){return this._bubbleType}set bubbleType(t){this._bubbleType=t}pop(){this.destroy()}fall(){this.body instanceof o.Physics.Arcade.Body&&(this.body.enable=!0,this.body.setVelocityY(200))}shot(t,e=600){const s=t.x-this.x,i=t.y-this.y,o=Math.sqrt(s*s+i*i);if(o>0){const t=s/o,n=i/o;this.body.setVelocity(t*e,n*e)}}disablePhysics(){this.body instanceof o.Physics.Arcade.Body&&(this.body.setVelocity(0,0),this.body.enable=!1)}addNeighbor(t){this.neighbors.add(t)}removeNeighbor(t){this.neighbors.delete(t)}checkCollision(t){for(const e of t.getBubbles())if(this.isOverlapping(e))return e;return console.log("No collision detected"),null}snapTo(t,e){console.log("Snapping bubble",{from:{x:this.x,y:this.y},to:{x:t,y:e}}),this.x=t,this.y=e}isOverlapping(t){const e=this.x-t.x,s=this.y-t.y,i=Math.sqrt(e*e+s*s);return console.log("Checking overlap",{shootingBubble:{x:this.x,y:this.y},targetBubble:{x:t.x,y:t.y},distance:i,diameterThreshold:this._diameter}),i<this._diameter}setBubbleSize(){if(this.width>0){const t=this._diameter/this.width;this.setScale(t)}else this.once(o.Loader.Events.COMPLETE,(()=>{const t=this._diameter/this.width;this.setScale(t)}))}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof o.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setVelocity(0,0),this.body.setBounce(1,1))}destroy(...t){this.neighbors.clear(),super.destroy(...t)}}class b extends o.GameObjects.Graphics{constructor(t,s){super(t),e(this,"origin"),e(this,"bubble"),e(this,"dashLength",10),e(this,"gapLength",5),e(this,"aimColor"),e(this,"target"),this.bubble=s,this.origin=new o.Math.Vector2(s.x,s.y),this.target=new o.Math.Vector2(0,0),this.aimColor=s.color.color,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){const t=this.scene.input;t.on("pointerdown",this.onPointerDown,this),t.on("pointermove",this.onPointerMove,this),t.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.updateTarget(t),this.redrawAimingLine(t)}onPointerMove(t){t.isDown&&(this.updateTarget(t),this.redrawAimingLine(t))}onPointerUp(){this.clear(),this.target.equals(this.origin)||this.bubble.shot({x:this.target.x,y:this.target.y})}updateTarget(t){this.target.set(t.x,t.y)}redrawAimingLine(t){this.clear(),this.lineStyle(1,this.aimColor);const e=o.Math.Angle.Between(this.origin.x,this.origin.y,t.x,t.y),s=Math.sqrt(Math.pow(this.scene.scale.width,2)+Math.pow(this.scene.scale.height,2)),i=new o.Math.Vector2(t.x+Math.cos(e)*s,t.y+Math.sin(e)*s);this.drawDashedLine(this.origin,new o.Math.Vector2(t.x,t.y)),this.drawDashedLine(new o.Math.Vector2(t.x,t.y),i)}drawDashedLine(t,e){const s=o.Math.Distance.Between(t.x,t.y,e.x,e.y),i=o.Math.Angle.Between(t.x,t.y,e.x,e.y);let n=s,h=t.clone();for(;n>0;){const t=Math.min(this.dashLength,n),e=new o.Math.Vector2(h.x+Math.cos(i)*t,h.y+Math.sin(i)*t);this.moveTo(h.x,h.y),this.lineTo(e.x,e.y),h.set(e.x+Math.cos(i)*this.gapLength,e.y+Math.sin(i)*this.gapLength),n-=this.dashLength+this.gapLength}this.strokePath()}destroy(...t){const e=this.scene.input;e.off("pointerdown",this.onPointerDown,this),e.off("pointermove",this.onPointerMove,this),e.off("pointerup",this.onPointerUp,this),super.destroy(...t)}}class a{constructor(t,s,i,o,n){e(this,"bubblesGroup"),e(this,"grid"),e(this,"bubbleWidth"),this.bubbleWidth=n,this.grid=Array.from({length:i},(()=>Array(s).fill(void 0))),this.createGrid(t,s,i,o)}createGrid(t,e,s,i){this.bubblesGroup=new Phaser.GameObjects.Group(t);const o=this.bubbleWidth/2,n=.866*this.bubbleWidth;let h=0;for(let b=0;b<s;b++){const s=b%2==0,a=s?o:0;for(let c=0;c<e-(s?1:0);c++){h++;const e=o+c*this.bubbleWidth+a,s=o+b*n,d=new l(t,e,s,this.bubbleWidth,"static",i,r());console.log(`Bubble ${h} position: ${e}, ${s}`),this.bubblesGroup.add(d),this.grid[b][c]=d}}}handleBubbleCollision(t,e){if(e.color.color===t.color.color)e.destroy(),t.destroy();else{const{x:s,y:i}=this.findNearestPositionForTargetBubble(e);t.snapTo(s,i),t.bubbleType="static"}}findNearestPositionForTargetBubble(t){const e=this.getPotentialNeighborPositions(t.x,t.y);for(const{x:s,y:i}of e)if(this.isPositionEmpty(s,i))return console.log("Nearest empty position found",{x:s,y:i}),{x:s,y:i};return console.warn("No empty position found, snapping to target bubble"),{x:t.x,y:t.y}}getPotentialNeighborPositions(t,e){const s=this.bubbleWidth,i=Math.sqrt(3);return[{x:t+s,y:e},{x:t-s,y:e},{x:t+s/2,y:+s*i/2},{x:t-s/2,y:+s*i/2},{x:t+s/2,y:-s*i/2},{x:t-s/2,y:-s*i/2}]}isPositionEmpty(t,e){return!this.getBubbles().some((s=>s.x===t&&s.y===e))}addBubble(t,e,s,i,o){const{row:n,col:h}=this.findClosestGridPosition(e,s);if(!this.isPositionOccupied(n,h)){const e=this.calculateBubbleX(h,n),s=this.calculateBubbleY(n),r=new l(t,e,s,this.bubbleWidth,"static",i,o);this.bubblesGroup.add(r),this.grid[n][h]=r}}findClosestGridPosition(t,e){const s=this.bubbleWidth/2,i=Math.round((e-s)/(s*Math.sqrt(3)));return{row:i,col:Math.round((t-s-(i%2==0?s:0))/this.bubbleWidth)}}isPositionOccupied(t,e){return t<0||t>=this.grid.length||e<0||e>=this.grid[0].length||void 0!==this.grid[t][e]}calculateBubbleX(t,e){const s=this.bubbleWidth/2,i=e%2==0?s:0;return s+t*this.bubbleWidth+i}calculateBubbleY(t){return this.bubbleWidth/2+t*(.866*this.bubbleWidth)}getBubbles(){return this.bubblesGroup.getChildren()}}class c extends Phaser.Scene{constructor(){super({key:"GameScene"}),e(this,"shootingBubble",null),e(this,"aimer",null),e(this,"cols",10),e(this,"rows",2),e(this,"bubbleCluster")}create(){const t=this.scale.width/this.cols;this.add.image(this.scale.width/2,this.scale.height/2,"background"),this.bubbleCluster=new a(this,this.cols,this.rows,"bubbles",t),this.spawnShootingBubble(t)}spawnShootingBubble(t){var e,s;null==(e=this.shootingBubble)||e.destroy(),null==(s=this.aimer)||s.destroy(),this.shootingBubble=new l(this,this.scale.width/2,this.scale.height-100,t,"shooting","bubbles",r()),this.aimer=new b(this,this.shootingBubble)}handleCollision(){this.shootingBubble&&this.shootingBubble.checkCollision(this.bubbleCluster)&&(this.bubbleCluster.handleBubbleCollision(this.shootingBubble,this.shootingBubble.checkCollision(this.bubbleCluster)),this.spawnShootingBubble(this.scale.width/this.cols))}update(){this.handleCollision()}}const d={type:o.AUTO,width:390,height:844,pixelArt:!1,title:"Purple Land",scene:[n,c],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(d)}));
