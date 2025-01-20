var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();const o=i(s());class h extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("background","assets/images/background/background.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json")}create(){this.scene.start("GameScene")}}const n=[{label:"orange",color:16081665},{label:"yellow",color:16109829},{label:"cyan",color:63127},{label:"light-blue",color:10150133},{label:"purple",color:9269719},{label:"pink",color:15626403}];function r(){const t=Math.floor(Math.random()*n.length);return{label:n[t].label,color:n[t].color}}class l extends o.GameObjects.Sprite{constructor(t,s,i,o,h="static",n="bubbles",r){super(t,s,i,n,r.label),e(this,"_bubbleType"),e(this,"_color"),e(this,"_width"),this._bubbleType=h,this._color=r,this._width=o,this.scene.add.existing(this),this.setBubbleSize(),this.initPhysics()}get color(){return this._color}get bubbleType(){return this._bubbleType}set bubbleType(t){this._bubbleType=t}pop(){this.destroy()}fall(){this.body instanceof o.Physics.Arcade.Body&&(this.body.enable=!0,this.body.setVelocityY(200))}shot(t,e=600){const s=t.x-this.x,i=t.y-this.y,o=Math.sqrt(s*s+i*i);if(o>0){const t=s/o,h=i/o;this.body.setVelocity(t*e,h*e)}}checkCollision(t){for(const e of t.getBubbles())if(this.isOverlapping(e))return e;return null}snapTo(t,e){this.scene.tweens.add({targets:this,x:t,y:e,duration:100,ease:"Power2"})}isOverlapping(t){const e=this.x-t.x,s=this.y-t.y;return Math.sqrt(e*e+s*s)<this._width}setBubbleSize(){if(this.width>0){const t=this._width/this.width;this.setScale(t)}else this.once(o.Loader.Events.COMPLETE,(()=>{const t=this._width/this.width;this.setScale(t)}))}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof o.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setVelocity(0,0),this.body.setBounce(1,1))}destroy(...t){super.destroy(...t)}}class b extends o.GameObjects.Graphics{constructor(t,s){super(t),e(this,"origin"),e(this,"bubble"),e(this,"dashLength",10),e(this,"gapLength",5),e(this,"aimColor"),e(this,"target"),this.bubble=s,this.origin=new o.Math.Vector2(s.x,s.y),this.target=new o.Math.Vector2(0,0),this.aimColor=s.color.color,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){const t=this.scene.input;t.on("pointerdown",this.onPointerDown,this),t.on("pointermove",this.onPointerMove,this),t.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.updateTarget(t),this.redrawAimingLine(t)}onPointerMove(t){t.isDown&&(this.updateTarget(t),this.redrawAimingLine(t))}onPointerUp(){this.clear(),this.target.equals(this.origin)||this.bubble.shot({x:this.target.x,y:this.target.y})}updateTarget(t){this.target.set(t.x,t.y)}redrawAimingLine(t){this.clear(),this.lineStyle(1,this.aimColor);const e=o.Math.Angle.Between(this.origin.x,this.origin.y,t.x,t.y),s=Math.sqrt(Math.pow(this.scene.scale.width,2)+Math.pow(this.scene.scale.height,2)),i=new o.Math.Vector2(t.x+Math.cos(e)*s,t.y+Math.sin(e)*s);this.drawDashedLine(this.origin,new o.Math.Vector2(t.x,t.y)),this.drawDashedLine(new o.Math.Vector2(t.x,t.y),i)}drawDashedLine(t,e){const s=o.Math.Distance.Between(t.x,t.y,e.x,e.y),i=o.Math.Angle.Between(t.x,t.y,e.x,e.y);let h=s,n=t.clone();for(;h>0;){const t=Math.min(this.dashLength,h),e=new o.Math.Vector2(n.x+Math.cos(i)*t,n.y+Math.sin(i)*t);this.moveTo(n.x,n.y),this.lineTo(e.x,e.y),n.set(e.x+Math.cos(i)*this.gapLength,e.y+Math.sin(i)*this.gapLength),h-=this.dashLength+this.gapLength}this.strokePath()}destroy(...t){const e=this.scene.input;e.off("pointerdown",this.onPointerDown,this),e.off("pointermove",this.onPointerMove,this),e.off("pointerup",this.onPointerUp,this),super.destroy(...t)}}class a{constructor(t,s,i,o,h){e(this,"scene"),e(this,"bubblesGroup"),e(this,"bubbleMap"),e(this,"grid"),e(this,"bubbleWidth"),e(this,"bubbleRadius"),e(this,"rowHeight"),this.scene=t,this.bubbleWidth=h,this.bubbleRadius=this.bubbleWidth/2,this.rowHeight=.866*this.bubbleWidth,this.bubblesGroup=new Phaser.GameObjects.Group(this.scene),this.bubbleMap=new Map,this.grid=Array.from({length:i},(()=>Array(s).fill(null))),this.createGrid(s,i,o)}handleBubbleCollision(t,e){if(e.color.color===t.color.color)return this.removeBubble(e),void this.removeBubble(t);t.body.setVelocity(0,0);const{x:s,y:i}=this.getNearestGridPosition(t.x,t.y);t.snapTo(s,i),t.bubbleType="static",this.addBubble(t)}getNearestGridPosition(t,e){let s=Math.round((e-this.bubbleRadius)/this.rowHeight);s<0&&(s=0);const i=s%2==0;let o;o=i?Math.round(t/this.bubbleWidth-1):Math.round(t/this.bubbleWidth-.5),o<0&&(o=0);const h=i?this.bubbleWidth*(o+1):this.bubbleWidth*(o+.5),n=this.bubbleRadius+s*this.rowHeight;return{x:this.normalize(h),y:this.normalize(n)}}addBubble(t){const e=this.normalize(t.x),s=this.normalize(t.y);this.bubblesGroup.add(t),this.bubbleMap.set(`${e},${s}`,t)}removeBubble(t){const e=this.normalize(t.x),s=this.normalize(t.y);this.bubblesGroup.remove(t,!1,!1),this.bubbleMap.delete(`${e},${s}`),t.destroy()}getBubbles(){return this.bubblesGroup.getChildren()}createGrid(t,e,s){let i=0;for(let o=0;o<e;o++){const e=o%2==0,h=e?this.bubbleRadius:0,n=t-(e?1:0);for(let t=0;t<n;t++){i++;const e=this.normalize(this.bubbleRadius+t*this.bubbleWidth+h),n=this.normalize(this.bubbleRadius+o*this.rowHeight),b=new l(this.scene,e,n,this.bubbleWidth,"static",s,r());console.log(`Bubble ${i} position: ${e}, ${n}`),this.bubblesGroup.add(b),this.bubbleMap.set(`${e},${n}`,b),this.grid[o][t]=b}}}normalize(t,e=2){return parseFloat(t.toFixed(e))}}class c extends Phaser.Scene{constructor(){super({key:"GameScene"}),e(this,"shootingBubble",null),e(this,"aimer",null),e(this,"cols",14),e(this,"rows",9),e(this,"bubbleCluster")}create(){const t=this.scale.width/this.cols;this.add.image(this.scale.width/2,this.scale.height/2,"background"),this.bubbleCluster=new a(this,this.cols,this.rows,"bubbles",t),this.spawnShootingBubble(t)}spawnShootingBubble(t){var e;null==(e=this.aimer)||e.destroy(),this.shootingBubble=new l(this,this.scale.width/2,this.scale.height-100,t,"shooting","bubbles",r()),this.aimer=new b(this,this.shootingBubble)}handleCollision(){var t;const e=null==(t=this.shootingBubble)?void 0:t.checkCollision(this.bubbleCluster);this.shootingBubble&&e&&(this.bubbleCluster.handleBubbleCollision(this.shootingBubble,e),this.spawnShootingBubble(this.scale.width/this.cols))}isBubbleMoving(){var t;return(null==(t=this.shootingBubble)?void 0:t.body).velocity.length()>0}update(){this.isBubbleMoving()&&this.handleCollision()}}const u={type:o.AUTO,width:390,height:844,pixelArt:!1,title:"Purple Land",scene:[h,c],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(u)}));
