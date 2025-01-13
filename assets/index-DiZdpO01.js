var t=Object.defineProperty,s=(s,i,e)=>((s,i,e)=>i in s?t(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e)(s,"symbol"!=typeof i?i+"":i,e);import{r as i,g as e}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver((t=>{for(const i of t)if("childList"===i.type)for(const t of i.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&s(t)})).observe(document,{childList:!0,subtree:!0})}function s(t){if(t.ep)return;t.ep=!0;const s=function(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?s.credentials="include":"anonymous"===t.crossOrigin?s.credentials="omit":s.credentials="same-origin",s}(t);fetch(t.href,s)}}();const o=e(i());class h extends o.Scene{constructor(){super({key:"BootScene"})}preload(){}create(){this.scene.start("GameScene")}}class r extends Phaser.GameObjects.Ellipse{constructor(t,i,e,o,h="static",r=16777215){super(t,i,e,o,o,r,1),s(this,"bubbleType"),s(this,"_color"),s(this,"neighbors",[]),this.bubbleType=h,this._color=r,this.scene.add.existing(this),this.initPhysics()}get color(){return this._color}setStatic(){this.bubbleType="static"}pop(){this.destroy()}fall(){this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.enable=!0,this.body.setVelocityY(200))}shot(t,s=600){if("shooting"!==this.bubbleType)return;const i=t.x-this.x,e=t.y-this.y,o=Math.sqrt(i*i+e*e);if(o>0){const t=i/o,h=e/o;this.body.setVelocity(t*s,h*s)}}disablePhysics(){this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.setVelocity(0,0),this.body.enable=!1)}addNeighbor(t){this.neighbors.includes(t)||this.neighbors.push(t)}removeNeighbor(t){const s=this.neighbors.indexOf(t);-1!==s&&this.neighbors.splice(s,1)}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setCircle(this.width/2),this.body.setVelocity(0,0))}}class n extends o.GameObjects.Graphics{constructor(t,i){super(t),s(this,"fromX"),s(this,"fromY"),s(this,"color"),s(this,"bubble"),s(this,"targetX",0),s(this,"targetY",0),s(this,"dashLength",10),s(this,"gapLength",5),this.fromX=i.x,this.fromY=i.y,this.color=i.color,this.bubble=i,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){this.scene.input.on("pointerdown",this.onPointerDown,this),this.scene.input.on("pointermove",this.onPointerMove,this),this.scene.input.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.clear(),this.updateTargetPosition(t),this.drawAimLine(t)}onPointerMove(t){t.isDown&&(this.clear(),this.updateTargetPosition(t),this.drawAimLine(t))}onPointerUp(){this.clear(),this.targetX&&this.targetY&&this.bubble.shot({x:this.targetX,y:this.targetY})}updateTargetPosition(t){this.targetX=t.x,this.targetY=t.y}drawAimLine(t){this.lineStyle(1,this.color),this.drawDashedLine(this.fromX,this.fromY,t.x,t.y);const s=o.Math.Angle.Between(this.fromX,this.fromY,t.x,t.y),i=Math.sqrt(this.scene.scale.width**2+this.scene.scale.height**2),e=t.x+Math.cos(s)*i,h=t.y+Math.sin(s)*i;this.drawDashedLine(t.x,t.y,e,h)}drawDashedLine(t,s,i,e){const h=o.Math.Distance.Between(t,s,i,e),r=o.Math.Angle.Between(t,s,i,e);let n=h,a=t,l=s;for(;n>0;){const t=Math.min(this.dashLength,n),s=a+Math.cos(r)*t,i=l+Math.sin(r)*t;this.moveTo(a,l),this.lineTo(s,i),n-=this.dashLength,a=s+Math.cos(r)*this.gapLength,l=i+Math.sin(r)*this.gapLength,n-=this.gapLength}this.strokePath()}}var a=(t=>(t[t.Red=16080992]="Red",t[t.Orange=16081665]="Orange",t[t.Yellow=16109829]="Yellow",t[t.LightGreen=10606216]="LightGreen",t[t.Green=5811254]="Green",t[t.Cyan=63127]="Cyan",t[t.LightBlue=10150133]="LightBlue",t[t.Purple=9269719]="Purple",t[t.Magenta=11945955]="Magenta",t[t.Pink=15626403]="Pink",t[t.Brown=11169619]="Brown",t))(a||{});function l(){const t=Object.values(a).filter((t=>"number"==typeof t));return t[Math.floor(Math.random()*t.length)]}class c extends Phaser.GameObjects.Group{constructor(t,i,e,o){super(t),s(this,"grid",[]),this.radius=i,this.rows=e,this.cols=o,this.generateGrid()}handleCollision(t,s){t.color===s.color?(this.chainPop(s,t.color),t.pop(),this.dropFloatingBubbles()):this.attachShootingBubble(t),this.spawnNewShootingBubble()}generateGrid(){for(let t=1;t<this.rows;t++){this.grid[t]=[];const s=t%2==1;for(let i=0;s?i<this.cols:i<this.cols-1;i++){const e=this.createSingleBubble(t,i,s);this.grid[t][i]=e,this.linkNeighbors(e,t,i)}}}createSingleBubble(t,s,i){const e=i?this.radius+s*this.radius*2:2*this.radius+s*this.radius*2,o=t*this.radius*Math.sqrt(3),h=l(),n=new r(this.scene,e,o,2*this.radius,"static",h);return this.add(n),n}attachShootingBubble(t){const{rowIndex:s,colIndex:i}=this.findNearestGridPosition(t.x,t.y);t.setStatic(),this.add(t),this.grid[s]||(this.grid[s]=[]),this.grid[s][i]=t,this.linkNeighbors(t,s,i)}findNearestGridPosition(t,s){const i=Math.round(s/(this.radius*Math.sqrt(3))),e=i%2==1?this.radius:2*this.radius;return{rowIndex:i,colIndex:Math.round((t-e)/(2*this.radius))}}linkNeighbors(t,s,i){const e=s%2==1;[{row:0,col:-1},{row:0,col:1},{row:-1,col:0},{row:-1,col:1},{row:1,col:0},{row:1,col:-1}].forEach((({row:o,col:h})=>{var n;const a=s+o,l=i+h+(e&&0!==o?1:0),c=null==(n=this.grid[a])?void 0:n[l];c&&c instanceof r&&(t.addNeighbor(c),c.addNeighbor(t))}))}chainPop(t,s){const i=[t],e=new Set;for(;i.length>0;){const t=i.pop();e.has(t)||(e.add(t),t.color===s&&(t.pop(),this.removeFromGrid(t),t.neighbors.filter((t=>t.color===s&&!e.has(t))).forEach((t=>i.push(t)))))}}removeFromGrid(t){var s;for(let i=0;i<this.grid.length;i++)for(let e=0;e<((null==(s=this.grid[i])?void 0:s.length)||0);e++)this.grid[i][e]===t&&(this.grid[i][e]=void 0);this.remove(t,!0,!1)}dropFloatingBubbles(){var t,s;const i=new Set;for(let e=0;e<((null==(t=this.grid[1])?void 0:t.length)||0);e++){const t=this.grid[1][e];t&&this.bfsMarkConnected(t,i)}for(let e=0;e<this.grid.length;e++)for(let t=0;t<((null==(s=this.grid[e])?void 0:s.length)||0);t++){const s=this.grid[e][t];s&&!i.has(s)&&(s.fall(),this.removeFromGrid(s))}}bfsMarkConnected(t,s){const i=[t];for(;i.length>0;){const t=i.shift();s.has(t)||(s.add(t),t.neighbors.filter((t=>!s.has(t))).forEach((t=>i.push(t))))}}spawnNewShootingBubble(){}}class d extends Phaser.Scene{constructor(){super({key:"GameScene"}),s(this,"shootingBubble"),s(this,"staticBubbles")}create(){const t=this.cameras.main.width/14/2;this.staticBubbles=new c(this,t,9,14),this.add.existing(this.staticBubbles),this.spawnShootingBubble(),this.physics.add.collider(this.shootingBubble,this.staticBubbles,this.onBubbleCollision,void 0,this)}spawnShootingBubble(){const t=this.cameras.main.width,s=this.cameras.main.height,i=t/14/2;this.shootingBubble&&this.shootingBubble.destroy(),this.shootingBubble=new r(this,t/2,s-100,2*i,"shooting",l()),new n(this,this.shootingBubble),this.physics.add.existing(this.shootingBubble)}onBubbleCollision(t,s){const i=t,e=s;this.staticBubbles.handleCollision(i,e),this.spawnShootingBubble(),this.physics.add.collider(this.shootingBubble,this.staticBubbles,this.onBubbleCollision,void 0,this)}}const b={type:o.AUTO,width:360,height:800,pixelArt:!1,title:"Purple Land",scene:[h,d],parent:"game-container",physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(b)}));
