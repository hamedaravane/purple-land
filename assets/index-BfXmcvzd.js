var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();const o=i(s());class h extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("background","assets/images/background/background.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json")}create(){this.scene.start("GameScene")}}const r=[{label:"orange",color:16081665},{label:"yellow",color:16109829},{label:"cyan",color:63127},{label:"light-blue",color:10150133},{label:"purple",color:9269719},{label:"pink",color:15626403}];function n(){const t=Math.floor(Math.random()*r.length);return{label:r[t].label,color:r[t].color}}class l extends o.GameObjects.Sprite{constructor(t,s,i,o,h="static",r="bubbles",n){super(t,s,i,r,n.label),e(this,"_bubbleType"),e(this,"_color"),e(this,"_diameter"),e(this,"neighbors"),this._bubbleType=h,this._color=n,this._diameter=o,this.neighbors=new Set,this.scene.add.existing(this),this.setBubbleSize(),this.initPhysics()}get color(){return this._color}get bubbleType(){return this._bubbleType}set bubbleType(t){this._bubbleType=t}pop(){this.destroy()}fall(){this.body instanceof o.Physics.Arcade.Body&&(this.body.enable=!0,this.body.setVelocityY(200))}shot(t,e=600){const s=t.x-this.x,i=t.y-this.y,o=Math.sqrt(s*s+i*i);if(o>0){const t=s/o,h=i/o;this.body.setVelocity(t*e,h*e)}}disablePhysics(){this.body instanceof o.Physics.Arcade.Body&&(this.body.setVelocity(0,0),this.body.enable=!1)}addNeighbor(t){this.neighbors.add(t)}removeNeighbor(t){this.neighbors.delete(t)}checkCollision(t){for(const e of t.getBubbles())if(this.isOverlapping(e))return e;return null}isOverlapping(t){const e=this.x-t.x,s=this.y-t.y;return Math.sqrt(e*e+s*s)<this._diameter}setBubbleSize(){if(this.width>0){const t=this._diameter/this.width;this.setScale(t)}else this.once(o.Loader.Events.COMPLETE,(()=>{const t=this._diameter/this.width;this.setScale(t)}))}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof o.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setVelocity(0,0),this.body.setBounce(1,1))}destroy(...t){this.neighbors.clear(),super.destroy(...t)}}class a extends o.GameObjects.Graphics{constructor(t,s){super(t),e(this,"origin"),e(this,"bubble"),e(this,"dashLength",10),e(this,"gapLength",5),e(this,"aimColor"),e(this,"target"),this.bubble=s,this.origin=new o.Math.Vector2(s.x,s.y),this.target=new o.Math.Vector2(0,0),this.aimColor=s.color.color,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){const t=this.scene.input;t.on("pointerdown",this.onPointerDown,this),t.on("pointermove",this.onPointerMove,this),t.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.updateTarget(t),this.redrawAimingLine(t)}onPointerMove(t){t.isDown&&(this.updateTarget(t),this.redrawAimingLine(t))}onPointerUp(){this.clear(),this.target.equals(this.origin)||this.bubble.shot({x:this.target.x,y:this.target.y})}updateTarget(t){this.target.set(t.x,t.y)}redrawAimingLine(t){this.clear(),this.lineStyle(1,this.aimColor);const e=o.Math.Angle.Between(this.origin.x,this.origin.y,t.x,t.y),s=Math.sqrt(Math.pow(this.scene.scale.width,2)+Math.pow(this.scene.scale.height,2)),i=new o.Math.Vector2(t.x+Math.cos(e)*s,t.y+Math.sin(e)*s);this.drawDashedLine(this.origin,new o.Math.Vector2(t.x,t.y)),this.drawDashedLine(new o.Math.Vector2(t.x,t.y),i)}drawDashedLine(t,e){const s=o.Math.Distance.Between(t.x,t.y,e.x,e.y),i=o.Math.Angle.Between(t.x,t.y,e.x,e.y);let h=s,r=t.clone();for(;h>0;){const t=Math.min(this.dashLength,h),e=new o.Math.Vector2(r.x+Math.cos(i)*t,r.y+Math.sin(i)*t);this.moveTo(r.x,r.y),this.lineTo(e.x,e.y),r.set(e.x+Math.cos(i)*this.gapLength,e.y+Math.sin(i)*this.gapLength),h-=this.dashLength+this.gapLength}this.strokePath()}destroy(...t){const e=this.scene.input;e.off("pointerdown",this.onPointerDown,this),e.off("pointermove",this.onPointerMove,this),e.off("pointerup",this.onPointerUp,this),super.destroy(...t)}}class b{constructor(t,s,i,o,h){e(this,"bubblesGroup"),e(this,"grid"),e(this,"bubbleWidth"),this.bubbleWidth=h,this.grid=Array.from({length:i},(()=>Array(s).fill(void 0))),this.createGrid(t,s,i,o)}createGrid(t,e,s,i){this.bubblesGroup=new Phaser.GameObjects.Group(t);const o=this.bubbleWidth/2,h=.866*this.bubbleWidth;for(let r=0;r<s;r++){const s=r%2==0,a=s?o:0;for(let b=0;b<e-(s?1:0);b++){const e=o+b*this.bubbleWidth+a,s=new l(t,e,o+r*h,this.bubbleWidth,"static",i,n());this.bubblesGroup.add(s),this.grid[r][b]=s}}}handleBubbleCollision(t,e,s){const{row:i,col:o}=this.findClosestGridPosition(e.x,e.y);if(i<0||i>=this.grid.length||o<0||o>=this.grid[0].length)return void e.pop();const h=this.grid[i][o];h&&h.color===e.color?e.pop():this.addBubble(t,e.x,e.y,s,e.color)}addBubble(t,e,s,i,o){const{row:h,col:r}=this.findClosestGridPosition(e,s);if(!this.isPositionOccupied(h,r)){const e=this.calculateBubbleX(r,h),s=this.calculateBubbleY(h),n=new l(t,e,s,this.bubbleWidth,"static",i,o);this.bubblesGroup.add(n),this.grid[h][r]=n}}findClosestGridPosition(t,e){const s=this.bubbleWidth/2,i=Math.round((e-s)/(s*Math.sqrt(3)));return{row:i,col:Math.round((t-s-(i%2==0?s:0))/this.bubbleWidth)}}isPositionOccupied(t,e){return t<0||t>=this.grid.length||e<0||e>=this.grid[0].length||void 0!==this.grid[t][e]}calculateBubbleX(t,e){const s=this.bubbleWidth/2,i=e%2==0?s:0;return s+t*this.bubbleWidth+i}calculateBubbleY(t){return this.bubbleWidth/2+t*(.866*this.bubbleWidth)}getBubbles(){return this.bubblesGroup.getChildren()}}class c extends Phaser.Scene{constructor(){super({key:"GameScene"}),e(this,"shootingBubble",null),e(this,"aimer",null),e(this,"cols",15),e(this,"rows",10),e(this,"bubbleCluster")}create(){const t=this.scale.width/this.cols;this.add.image(this.scale.width/2,this.scale.height/2,"background"),this.bubbleCluster=new b(this,this.cols,this.rows,"bubbles",t),this.spawnShootingBubble(t)}spawnShootingBubble(t){var e,s;null==(e=this.shootingBubble)||e.destroy(),null==(s=this.aimer)||s.destroy(),this.shootingBubble=new l(this,this.scale.width/2,this.scale.height-100,t,"shooting","bubbles",n()),this.aimer=new a(this,this.shootingBubble)}handleCollision(){this.shootingBubble&&this.shootingBubble.checkCollision(this.bubbleCluster)&&(this.bubbleCluster.handleBubbleCollision(this,this.shootingBubble,"bubbles"),this.spawnShootingBubble(this.scale.width/this.cols))}update(){this.handleCollision()}}const d={type:o.AUTO,width:390,height:844,pixelArt:!1,title:"Purple Land",scene:[h,c],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(d)}));