var t=Object.defineProperty,s=(s,e,i)=>((s,e,i)=>e in s?t(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i)(s,"symbol"!=typeof e?e+"":e,i);import{r as e,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver((t=>{for(const e of t)if("childList"===e.type)for(const t of e.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&s(t)})).observe(document,{childList:!0,subtree:!0})}function s(t){if(t.ep)return;t.ep=!0;const s=function(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?s.credentials="include":"anonymous"===t.crossOrigin?s.credentials="omit":s.credentials="same-origin",s}(t);fetch(t.href,s)}}();const o=i(e());class h extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("background","assets/images/background/background.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json")}create(){this.scene.start("GameScene")}}class r extends Phaser.GameObjects.Sprite{constructor(t,e,i,o,h="static",r){super(t,e,i,"bubbles",r.label),s(this,"bubbleType"),s(this,"_color"),s(this,"neighbors",[]),s(this,"_diameter"),this.bubbleType=h,this._color=r,this._diameter=o,this.scene.add.existing(this),this.setOrigin(.5,.5),this.setBubbleSize(),this.initPhysics()}get color(){return this._color}setStatic(){this.bubbleType="static"}pop(){this.destroy()}fall(){this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.enable=!0,this.body.setVelocityY(200))}shot(t,s=600){if("shooting"!==this.bubbleType)return;const e=t.x-this.x,i=t.y-this.y,o=Math.sqrt(e*e+i*i);if(o>0){const t=e/o,h=i/o;this.body.setVelocity(t*s,h*s)}}disablePhysics(){this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.setVelocity(0,0),this.body.enable=!1)}addNeighbor(t){this.neighbors.includes(t)||this.neighbors.push(t)}removeNeighbor(t){const s=this.neighbors.indexOf(t);-1!==s&&this.neighbors.splice(s,1)}setBubbleSize(){const t=this.width,s=this.height;if(t>0&&s>0){const s=this._diameter/t;this.setScale(s)}else this.once(Phaser.Loader.Events.COMPLETE,(()=>{const t=this._diameter/this.width;this.setScale(t)}))}initPhysics(){if(this.scene.physics.add.existing(this),this.body instanceof Phaser.Physics.Arcade.Body){const t=this._diameter/2;this.body.setCollideWorldBounds(!0),this.body.setCircle(t,-t,-t),this.body.setVelocity(0,0)}}}class n extends o.GameObjects.Graphics{constructor(t,e){super(t),s(this,"fromX"),s(this,"fromY"),s(this,"color"),s(this,"bubble"),s(this,"targetX",0),s(this,"targetY",0),s(this,"dashLength",10),s(this,"gapLength",5),this.fromX=e.x,this.fromY=e.y,this.color=e.color.color,this.bubble=e,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){this.scene.input.on("pointerdown",this.onPointerDown,this),this.scene.input.on("pointermove",this.onPointerMove,this),this.scene.input.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.clear(),this.updateTargetPosition(t),this.drawAimLine(t)}onPointerMove(t){t.isDown&&(this.clear(),this.updateTargetPosition(t),this.drawAimLine(t))}onPointerUp(){this.clear(),this.targetX&&this.targetY&&this.bubble.shot({x:this.targetX,y:this.targetY})}updateTargetPosition(t){this.targetX=t.x,this.targetY=t.y}drawAimLine(t){this.lineStyle(1,this.color),this.drawDashedLine(this.fromX,this.fromY,t.x,t.y);const s=o.Math.Angle.Between(this.fromX,this.fromY,t.x,t.y),e=Math.sqrt(this.scene.scale.width**2+this.scene.scale.height**2),i=t.x+Math.cos(s)*e,h=t.y+Math.sin(s)*e;this.drawDashedLine(t.x,t.y,i,h)}drawDashedLine(t,s,e,i){const h=o.Math.Distance.Between(t,s,e,i),r=o.Math.Angle.Between(t,s,e,i);let n=h,l=t,a=s;for(;n>0;){const t=Math.min(this.dashLength,n),s=l+Math.cos(r)*t,e=a+Math.sin(r)*t;this.moveTo(l,a),this.lineTo(s,e),n-=this.dashLength,l=s+Math.cos(r)*this.gapLength,a=e+Math.sin(r)*this.gapLength,n-=this.gapLength}this.strokePath()}destroy(...t){this.scene&&this.scene.input&&(this.scene.input.off("pointerdown",this.onPointerDown,this),this.scene.input.off("pointermove",this.onPointerMove,this),this.scene.input.off("pointerup",this.onPointerUp,this)),super.destroy(...t)}}const l=new Map([["red",16080992],["orange",16081665],["yellow",16109829],["light-green",10606216],["green",5811254],["cyan",63127],["light-blue",10150133],["purple",9269719],["magenta",11945955],["pink",15626403],["brown",11169619]]);function a(){const t=Array.from(l.keys()),s=t[Math.floor(Math.random()*t.length)];return{label:s,color:l.get(s)}}class c extends Phaser.GameObjects.Group{constructor(t,e,i,o){super(t),s(this,"grid",[]),this.bubbleWidth=e,this.rows=i,this.cols=o,this.generateGrid()}handleCollision(t,s){t.color.label===s.color.label?(this.chainPop(s,t.color.label),t.pop(),this.dropFloatingBubbles()):this.attachShootingBubble(t)}generateGrid(){for(let t=0;t<this.rows;t++){this.grid[t]=[];for(let s=0;s<this.cols;s++){const e=new r(this.scene,t*this.bubbleWidth,s*this.bubbleWidth,this.bubbleWidth,"static",a());this.add(e),this.grid[t][s]=e,this.linkNeighbors(e,t,s)}}}attachShootingBubble(t){const{rowIndex:s,colIndex:e}=this.findNearestGridPosition(t.x,t.y),{r:i,c:o}=this.findClosestEmptySlot(s,e),{x:h,y:r}=this.computeBubblePosition(i,o);t.setPosition(h,r),t.setStatic(),this.add(t),this.grid[i]||(this.grid[i]=[]),this.grid[i][o]=t,this.linkNeighbors(t,i,o)}findNearestGridPosition(t,s){const e=Math.round(s/(this.bubbleWidth*Math.sqrt(3))),i=e%2==1?this.bubbleWidth:2*this.bubbleWidth;return{rowIndex:e,colIndex:Math.round((t-i)/(2*this.bubbleWidth))}}findClosestEmptySlot(t,s){const e=new Set,i=[{r:t,c:s}];for(;i.length;){const{r:t,c:s}=i.shift();if(!this.grid[t]||!this.grid[t][s])return{r:t,c:s};e.add(`${t},${s}`),this.getGridNeighbors(t,s).forEach((t=>{const s=`${t.r},${t.c}`;e.has(s)||i.push(t)}))}return{r:t,c:s}}getGridNeighbors(t,s){const e=t%2==1;return[{r:t,c:s-1},{r:t,c:s+1},{r:t-1,c:s+(e?0:-1)},{r:t-1,c:s+(e?1:0)},{r:t+1,c:s+(e?0:-1)},{r:t+1,c:s+(e?1:0)}]}computeBubblePosition(t,s){return{x:t%2==1?this.bubbleWidth+s*this.bubbleWidth*2:2*this.bubbleWidth+s*this.bubbleWidth*2,y:t*this.bubbleWidth*Math.sqrt(3)}}linkNeighbors(t,s,e){const i=s%2==1;[{row:0,col:-1},{row:0,col:1},{row:-1,col:0},{row:-1,col:1},{row:1,col:0},{row:1,col:-1}].forEach((({row:o,col:h})=>{var n;const l=s+o,a=e+h+(i&&0!==o?1:0),c=null==(n=this.grid[l])?void 0:n[a];c&&c instanceof r&&(t.addNeighbor(c),c.addNeighbor(t))}))}chainPop(t,s){const e=[t],i=new Set;for(;e.length;){const t=e.pop();i.has(t)||(i.add(t),t.color.label===s&&(t.pop(),this.removeFromGrid(t),t.neighbors.filter((t=>t.color.label===s&&!i.has(t))).forEach((t=>e.push(t)))))}}removeFromGrid(t){var s;for(let e=0;e<this.grid.length;e++)for(let i=0;i<((null==(s=this.grid[e])?void 0:s.length)||0);i++)this.grid[e][i]===t&&(this.grid[e][i]=void 0);this.remove(t,!0,!1)}dropFloatingBubbles(){var t;const s=new Set;if(this.grid[1])for(let e=0;e<this.grid[1].length;e++){const t=this.grid[1][e];t&&this.bfsMarkConnected(t,s)}for(let e=0;e<this.grid.length;e++)for(let i=0;i<((null==(t=this.grid[e])?void 0:t.length)||0);i++){const t=this.grid[e][i];t&&!s.has(t)&&(t.fall(),this.removeFromGrid(t))}}bfsMarkConnected(t,s){const e=[t];for(;e.length;){const t=e.shift();s.has(t)||(s.add(t),t.neighbors.forEach((t=>{s.has(t)||e.push(t)})))}}}class b extends Phaser.Scene{constructor(){super({key:"GameScene"}),s(this,"shootingBubble"),s(this,"staticBubbles"),s(this,"aimer"),s(this,"cols"),s(this,"rows"),s(this,"bubbleWidth")}create(){this.cols=12,this.rows=12,this.bubbleWidth=this.scale.width/this.cols,console.log("Creating Game Scene"),console.log("screen width",this.scale.width,"bubble width",this.bubbleWidth);const t=new Phaser.GameObjects.Sprite(this,0,0,"background");this.add.existing(t),this.staticBubbles=new c(this,this.bubbleWidth,this.rows,this.cols),this.add.existing(this.staticBubbles),this.spawnShootingBubble()}spawnShootingBubble(){this.shootingBubble&&this.shootingBubble.destroy(),this.aimer&&this.aimer.destroy(),this.shootingBubble=new r(this,this.scale.width/2,this.scale.height-100,this.bubbleWidth,"shooting",a()),this.physics.add.existing(this.shootingBubble),this.aimer=new n(this,this.shootingBubble),this.physics.add.collider(this.shootingBubble,this.staticBubbles,((t,s)=>this.onBubbleCollision(t,s)))}onBubbleCollision(t,s){this.staticBubbles.handleCollision(t,s),this.spawnShootingBubble()}}const d={type:o.AUTO,width:360,height:800,pixelArt:!1,title:"Purple Land",scene:[h,b],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(d)}));
