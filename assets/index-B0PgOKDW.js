var e=Object.defineProperty,t=(t,s,i)=>((t,s,i)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i)(t,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const n=i(s());class o extends n.Scene{constructor(){super({key:"BootScene"})}preload(){}create(){this.scene.start("GameScene")}}class r extends Phaser.GameObjects.Ellipse{constructor(e,s,i,n="static",o=16777215){super(e,s,i,25,25,o,1),t(this,"bubbleType"),t(this,"_color"),this.bubbleType=n,this._color=o,e.add.existing(this),this.enablePhysics()}get color(){return this._color}pop(){this.destroy()}shot(e,t=600){if("shooting"===this.bubbleType){const s=e.x-this.x,i=e.y-this.y,n=Math.sqrt(s**2+i**2);if(n>0){const e=s/n,o=i/n;this.body.setVelocity(e*t,o*t)}}}enablePhysics(){this.scene.physics.add.existing(this),this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setCircle(this.width/2),this.body.setVelocity(0,0))}disablePhysics(){this.body instanceof Phaser.Physics.Arcade.Body&&(this.body.setVelocity(0,0),this.body.enable=!1)}}class h extends n.GameObjects.Graphics{constructor(e,s){super(e),t(this,"fromX"),t(this,"fromY"),t(this,"color"),t(this,"bubble"),t(this,"targetX",0),t(this,"targetY",0),t(this,"dashLength",10),t(this,"gapLength",5),this.fromX=s.x,this.fromY=s.y,this.color=s.color,this.bubble=s,e.add.existing(this),this.registerInputListeners()}registerInputListeners(){this.scene.input.on("pointerdown",this.onPointerDown,this),this.scene.input.on("pointermove",this.onPointerMove,this),this.scene.input.on("pointerup",this.onPointerUp,this)}onPointerDown(e){this.clear(),this.updateTargetPosition(e),this.drawAimLine(e)}onPointerMove(e){e.isDown&&(this.clear(),this.updateTargetPosition(e),this.drawAimLine(e))}onPointerUp(){this.clear(),this.targetX&&this.targetY&&this.bubble.shot({x:this.targetX,y:this.targetY})}updateTargetPosition(e){this.targetX=e.x,this.targetY=e.y}drawAimLine(e){this.lineStyle(1,this.color),this.drawDashedLine(this.fromX,this.fromY,e.x,e.y);const t=n.Math.Angle.Between(this.fromX,this.fromY,e.x,e.y),s=Math.sqrt(this.scene.scale.width**2+this.scene.scale.height**2),i=e.x+Math.cos(t)*s,o=e.y+Math.sin(t)*s;this.drawDashedLine(e.x,e.y,i,o)}drawDashedLine(e,t,s,i){const o=n.Math.Distance.Between(e,t,s,i),r=n.Math.Angle.Between(e,t,s,i);let h=o,a=e,c=t;for(;h>0;){const e=Math.min(this.dashLength,h),t=a+Math.cos(r)*e,s=c+Math.sin(r)*e;this.moveTo(a,c),this.lineTo(t,s),h-=this.dashLength,a=t+Math.cos(r)*this.gapLength,c=s+Math.sin(r)*this.gapLength,h-=this.gapLength}this.strokePath()}}var a=(e=>(e[e.Red=16080992]="Red",e[e.Orange=16081665]="Orange",e[e.Yellow=16109829]="Yellow",e[e.LightGreen=10606216]="LightGreen",e[e.Green=5811254]="Green",e[e.Cyan=63127]="Cyan",e[e.LightBlue=10150133]="LightBlue",e[e.Purple=9269719]="Purple",e[e.Magenta=11945955]="Magenta",e[e.Pink=15626403]="Pink",e[e.Brown=11169619]="Brown",e))(a||{});function c(){const e=Object.values(a).filter((e=>"number"==typeof e));return e[Math.floor(Math.random()*e.length)]}class l extends Phaser.GameObjects.Group{constructor(e,s,i,n){super(e),t(this,"scene"),this.scene=e,this.createHexGrid(s,i,n)}createHexGrid(e,t,s){for(let i=1;i<t;i++){let t=i%2==1;for(let n=0;t?n<s:n<s-1;n++){let s={x:t?e+n*e*2:2*e+n*e*2,y:i*e*Math.sqrt(3)},o=c();const h=new r(this.scene,s.x,s.y,"static",o);this.scene.physics.add.existing(h),this.scene.add.existing(h),this.add(h)}}}}class d extends Phaser.Scene{constructor(){super({key:"GameScene"}),t(this,"shootingBubble"),t(this,"staticBubbles")}create(){this.shootingBubble=new r(this,this.cameras.main.width/2,this.cameras.main.height-100,"shooting",c()),new h(this,this.shootingBubble),this.staticBubbles=new l(this,12.5,12,12),this.add.existing(this.staticBubbles),this.physics.add.collider(this.shootingBubble,this.staticBubbles)}}const u={type:n.AUTO,width:360,height:800,pixelArt:!1,title:"Purple Land",scene:[o,d],parent:"game-container",physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new n.Game(u)}));
