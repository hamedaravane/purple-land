var e=Object.defineProperty,t=(t,s,i)=>((t,s,i)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i)(t,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const o=i(s());class r extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("background","assets/images/background/background.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json")}create(){this.scene.start("GameScene")}}const h={label:"pink",color:15626403},n=[{label:"orange",color:16081665},{label:"yellow",color:16109829},{label:"cyan",color:63127},{label:"light-blue",color:10150133},{label:"purple",color:9269719},{label:"pink",color:15626403}];class l extends o.GameObjects.Sprite{constructor(e,s,i,o,r=h,n=!1,l="bubbles"){super(e,s,i,l,r.label),t(this,"isShooter"),t(this,"color"),t(this,"diameter"),t(this,"gridCoordinates"),this.isShooter=n,this.color=r,this.diameter=o,this.setBubbleSize(),this.initPhysics(),this.scene.add.existing(this)}shot(e,t=600){if(!this.isShooter)return;const s=e.x-this.x,i=e.y-this.y,o=Math.sqrt(s*s+i*i);if(o>0){const e=s/o,r=i/o;this.body.setVelocity(e*t,r*t)}}setPosition(e,t){return this.scene.tweens.add({targets:this,x:e,y:t,duration:100,ease:"Power2"}),super.setPosition(e,t)}setBubbleSize(){if(this.width>0){const e=this.diameter/this.width;this.setScale(e)}else this.once(o.Loader.Events.COMPLETE,(()=>{const e=this.diameter/this.width;this.setScale(e)}))}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof o.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setVelocity(0,0),this.body.setBounce(1,1))}}const a={even:[[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]],odd:[[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]};function c(){const e=Math.floor(Math.random()*n.length);return{label:n[e].label,color:n[e].color}}class d extends o.GameObjects.Group{constructor(e,s,i){super(e),t(this,"rows"),t(this,"cols"),t(this,"cellWidth"),t(this,"cellHeight"),t(this,"bubbleRadius"),t(this,"grid"),this.rows=s,this.cols=i,this.cellWidth=e.scale.width/i,this.bubbleRadius=this.cellWidth/2,this.cellHeight=.866*this.cellWidth;const o=e.scale.height-100-this.cellHeight,r=Math.floor(o/this.cellHeight);this.grid=Array.from({length:r},(()=>Array(i).fill(null)))}createGrid(){for(let e=0;e<this.rows;e++){const t=e%2==0,s=t?this.bubbleRadius:0,i=this.cols-(t?1:0);for(let o=0;o<i;o++){const t=this.normalize(this.bubbleRadius+o*this.cellWidth+s),i=this.normalize(this.bubbleRadius+e*this.cellHeight),r=new l(this.scene,t,i,this.cellWidth,c());r.gridCoordinates={row:e,col:o},this.add(r),this.grid[e][o]=r}}}addBubble(e){const{row:t,col:s}=e.gridCoordinates;this.grid[t][s]=e,this.add(e)}removeBubble(e){const{row:t,col:s}=e.gridCoordinates;this.grid[t]&&this.grid[t][s]===e&&(this.grid[t][s]=null),this.remove(e,!0,!0)}popConnectedBubbles(e){const t=this.findConnectedSameColor(e);t.length>=3&&t.forEach((e=>this.removeBubble(e)))}findConnectedSameColor(e){const t=new Set,s=[e];for(;s.length>0;){const i=s.shift();if(!t.has(i)){t.add(i);for(const o of this.getNeighbors(i))o&&!t.has(o)&&o.color.color===e.color.color&&s.push(o)}}return Array.from(t)}getNeighbors(e){const{row:t,col:s}=e.gridCoordinates,i=a[t%2==0?"even":"odd"],o=[];for(const[r,h]of i){const e=t+r,i=s+h;if(this.isValidCell(e,i)){const t=this.grid[e][i];t&&o.push(t)}}return o}snapBubbleToGrid(e){const{snappedX:t,snappedY:s,row:i,col:o}=this.getNearestGridPosition(e.x,e.y);e.setPosition(t,s),e.gridCoordinates={row:i,col:o},this.addBubble(e)}getNearestGridPosition(e,t){let s=Math.round((t-this.bubbleRadius)/this.cellHeight);s<0&&(s=0);const i=s%2==0;let o;o=i?Math.round(e/this.cellWidth-1):Math.round(e/this.cellWidth-.5),o<0&&(o=0);const r=i?this.cellWidth*(o+1):this.cellWidth*(o+.5),h=this.bubbleRadius+s*this.cellHeight;return{snappedX:this.normalize(r),snappedY:this.normalize(h),row:s,col:o}}getChildren(){return super.getChildren()}isValidCell(e,t){return e>=0&&e<this.rows&&t>=0&&t<this.cols}getCellWidth(){return this.cellWidth}normalize(e,t=2){return parseFloat(e.toFixed(t))}}class b extends o.GameObjects.Graphics{constructor(e,s){super(e),t(this,"origin"),t(this,"bubble"),t(this,"dashLength",10),t(this,"gapLength",5),t(this,"aimColor"),t(this,"target"),this.bubble=s,this.origin=new o.Math.Vector2(s.x,s.y),this.target=new o.Math.Vector2(0,0),this.aimColor=s.color.color,e.add.existing(this),this.registerInputListeners()}registerInputListeners(){const e=this.scene.input;e.on("pointerdown",this.onPointerDown,this),e.on("pointermove",this.onPointerMove,this),e.on("pointerup",this.onPointerUp,this)}onPointerDown(e){this.updateTarget(e),this.redrawAimingLine(e)}onPointerMove(e){e.isDown&&(this.updateTarget(e),this.redrawAimingLine(e))}onPointerUp(){this.clear(),this.target.equals(this.origin)||this.bubble.shot({x:this.target.x,y:this.target.y})}updateTarget(e){this.target.set(e.x,e.y)}redrawAimingLine(e){this.clear(),this.lineStyle(1,this.aimColor);const t=o.Math.Angle.Between(this.origin.x,this.origin.y,e.x,e.y),s=Math.sqrt(Math.pow(this.scene.scale.width,2)+Math.pow(this.scene.scale.height,2)),i=new o.Math.Vector2(e.x+Math.cos(t)*s,e.y+Math.sin(t)*s);this.drawDashedLine(this.origin,new o.Math.Vector2(e.x,e.y)),this.drawDashedLine(new o.Math.Vector2(e.x,e.y),i)}drawDashedLine(e,t){const s=o.Math.Distance.Between(e.x,e.y,t.x,t.y),i=o.Math.Angle.Between(e.x,e.y,t.x,t.y);let r=s,h=e.clone();for(;r>0;){const e=Math.min(this.dashLength,r),t=new o.Math.Vector2(h.x+Math.cos(i)*e,h.y+Math.sin(i)*e);this.moveTo(h.x,h.y),this.lineTo(t.x,t.y),h.set(t.x+Math.cos(i)*this.gapLength,t.y+Math.sin(i)*this.gapLength),r-=this.dashLength+this.gapLength}this.strokePath()}destroy(...e){const t=this.scene.input;t.off("pointerdown",this.onPointerDown,this),t.off("pointermove",this.onPointerMove,this),t.off("pointerup",this.onPointerUp,this),super.destroy(...e)}}class u{constructor(e,s,i){t(this,"scene"),t(this,"bubbleGrid"),t(this,"aimer"),t(this,"shootingBubble"),this.scene=e,this.bubbleGrid=new d(e,s,i),this.scene.add.existing(this.bubbleGrid)}createGrid(){this.bubbleGrid.createGrid()}spawnNewShootingBubble(){var e;null==(e=this.aimer)||e.destroy(),this.shootingBubble=new l(this.scene,this.scene.scale.width/2,this.scene.scale.height-100,this.bubbleGrid.getCellWidth(),c(),!0),this.aimer=new b(this.scene,this.shootingBubble)}checkCollision(){this.bubbleGrid.getChildren().forEach((e=>{this.isOverlap(this.shootingBubble,e)&&(this.shootingBubble.body.setVelocity(0,0),this.bubbleGrid.snapBubbleToGrid(this.shootingBubble),this.bubbleGrid.popConnectedBubbles(this.shootingBubble),this.spawnNewShootingBubble())}))}isOverlap(e,t){const s=e.x-t.x,i=e.y-t.y;return s*s+i*i<=e.diameter*t.diameter}}class g extends Phaser.Scene{constructor(){super({key:"GameScene"}),t(this,"bubbleManager")}create(){this.add.image(this.scale.width/2,this.scale.height/2,"background"),this.bubbleManager=new u(this,10,14),this.bubbleManager.createGrid(),this.bubbleManager.spawnNewShootingBubble()}update(){this.bubbleManager.checkCollision()}}const p={type:o.AUTO,width:390,height:844,pixelArt:!1,title:"Purple Land",scene:[r,g],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(p)}));
