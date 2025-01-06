var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();var h=s();const o=i(h);class r extends o.GameObjects.Container{constructor(t,s,i,h,o,r){super(t,i,s),e(this,"q"),e(this,"r"),e(this,"x"),e(this,"y"),e(this,"bubble"),e(this,"tileGraphics"),e(this,"size"),this.q=s,this.r=i,this.x=h,this.y=o,this.size=r,this.bubble=null,this.tileGraphics=t.add.graphics({x:this.x,y:this.y}),this.drawTile(),this.setupInteractivity(t)}drawTile(){this.tileGraphics.clear(),this.tileGraphics.lineStyle(1,13421772,1),this.tileGraphics.beginPath(),r.getHexPoints(this.size).forEach(((t,e)=>{0===e?this.tileGraphics.moveTo(t.x,t.y):this.tileGraphics.lineTo(t.x,t.y)})),this.tileGraphics.closePath(),this.tileGraphics.strokePath()}static getHexPoints(t){const e=[];for(let s=0;s<6;s++){const i=60*s-30,h=o.Math.DegToRad(i);e.push(new o.Geom.Point(t*Math.cos(h),t*Math.sin(h)))}return e}placeBubble(t){this.bubble?console.warn(`Tile (${this.q}, ${this.r}) is already occupied.`):(this.bubble=t,t.setPosition(this.x,this.y))}removeBubble(){this.bubble&&(this.bubble=null)}isEmpty(){return null===this.bubble}getNeighbors(t){return[{dq:1,dr:0},{dq:1,dr:-1},{dq:0,dr:-1},{dq:-1,dr:0},{dq:-1,dr:1},{dq:0,dr:1}].map((e=>t.getTile(this.r+e.dr,this.q+e.dq))).filter((t=>void 0!==t))}setupInteractivity(t){this.tileGraphics.setInteractive(r.getHexPoints(this.size).map((t=>({x:t.x,y:t.y}))),o.Geom.Polygon.Contains),this.tileGraphics.on("pointerdown",(()=>{this.bubble&&(this.removeBubble(),t.events.emit("bubblePopped",this))})),this.tileGraphics.on("pointerover",(()=>{this.tileGraphics.lineStyle(2,65280,1),this.tileGraphics.strokePath()})),this.tileGraphics.on("pointerout",(()=>{this.tileGraphics.lineStyle(1,13421772,1),this.tileGraphics.strokePath()}))}}class l{constructor(t,s,i){e(this,"tiles",[]),e(this,"scene"),e(this,"numCols"),e(this,"numRows"),e(this,"size"),e(this,"hexWidth"),e(this,"hexHeight"),e(this,"hSpacing"),e(this,"vSpacing"),this.scene=t,this.numCols=s,this.numRows=i,this.size=this.calculateHexSize(),this.hexWidth=Math.sqrt(3)*this.size,this.hexHeight=2*this.size,this.hSpacing=this.hexWidth,this.vSpacing=1.5*this.size,this.tiles=[],this.createGrid(),this.scene.scale.on("resize",this.onResize,this)}calculateHexSize(){return this.scene.scale.width/this.numCols/Math.sqrt(3)}createGrid(){const t=this.calculateGridStartY(),e=this.scene.scale.width/2,s=this.calculateMaxColumns();for(let i=0;i<this.numRows;i++){const h=this.getHexesInRow(s),o=this.calculateTotalRowWidth(h),l=this.calculateGridStartX(e,o),n=this.getRowOffset(i),c=[];for(let e=0;e<h;e++){const s=this.calculateHexXPosition(l,e,n),h=this.calculateHexYPosition(t,i),o=new r(this.scene,e,i,s,h,this.size);c.push(o)}this.tiles.push(c)}}calculateGridStartY(){const t=(this.numRows-1)*this.vSpacing+this.hexHeight;return(this.scene.scale.height-t)/2}getHexesInRow(t){return t}calculateTotalRowWidth(t){return t<=0?0:(t-1)*this.hSpacing+this.hexWidth}calculateGridStartX(t,e){return t-e/2}getRowOffset(t){return t%2!=0?this.hSpacing/2:0}calculateHexXPosition(t,e,s){return t+e*this.hSpacing+s}calculateHexYPosition(t,e){return t+e*this.vSpacing}calculateMaxColumns(){const t=.9*this.scene.scale.width,e=Math.floor((t-this.hexWidth)/this.hSpacing+1);return Math.min(this.numCols,e)}onResize(){this.destroyGrid(),this.createGrid()}destroyGrid(){for(const t of this.tiles)for(const e of t)e.destroy();this.tiles=[]}getTile(t,e){if(t<0||t>=this.tiles.length)return;const s=this.tiles[t];return e<0||e>=s.length?void 0:s[e]}placeBubbleNear(t,e,s){let i=null,h=1/0;for(const o of this.tiles)for(const s of o)if(s.isEmpty()){const o=Phaser.Math.Distance.Between(t,e,s.x,s.y);o<h&&(h=o,i=s)}return i?(i.placeBubble(s),!0):(console.warn("No empty tile found near the target position."),!1)}findConnectedBubbles(t,e,s,i=new Set){var h;const o=this.getTile(t,e);if(!o||(null==(h=o.bubble)?void 0:h.color)!==s||i.has(`${t},${e}`))return[];i.add(`${t},${e}`);let r=[o];return o.getNeighbors(this).forEach((t=>{r=r.concat(this.findConnectedBubbles(t.r,t.q,s,i))})),r}checkForMatches(){const t=[],e=new Set;this.tiles.forEach((s=>{s.forEach((s=>{if(s.bubble&&!e.has(`${s.r},${s.q}`)){const i=this.findConnectedBubbles(s.r,s.q,s.bubble.color,e);i.length>=3&&t.push(i)}}))})),t.forEach((t=>{t.forEach((t=>{t.removeBubble()}))}))}}class n extends o.Physics.Arcade.Sprite{constructor(t,s,i,h,o){super(t,s,i,h),e(this,"color"),this.color=o,t.add.existing(this),t.physics.add.existing(this),this.body.setCircle(this.width/2),this.body.setImmovable(!0)}pop(){this.scene.add.tween({targets:this,scale:0,alpha:0,duration:300,ease:"Power2",onComplete:()=>{this.destroy()}})}}class c extends o.Scene{constructor(){super({key:"BubbleShooterScene"}),e(this,"hexGrid"),e(this,"bubbleGroup"),e(this,"shooterX"),e(this,"shooterY"),e(this,"aimer"),e(this,"collideCallback",((t,e)=>{t!==e&&(t.body.setVelocity(0,0),this.placeBubbleAtBubblePosition(t))}))}preload(){}create(){this.hexGrid=new l(this,12,5),this.bubbleGroup=this.physics.add.group(),[{row:5,col:5,color:"red"},{row:5,col:6,color:"blue"},{row:6,col:5,color:"green"}].forEach((t=>{const e=this.hexGrid.getTile(t.row,t.col);if(e&&e.isEmpty()){const s=new n(this,e.x,e.y,`bubble_${t.color}`,t.color);e.placeBubble(s),this.bubbleGroup.add(s)}})),this.shooterX=this.cameras.main.width/2,this.shooterY=this.cameras.main.height-50,this.add.sprite(this.shooterX,this.shooterY,"shooter").setDepth(1),this.events.on("shootBubble",this.handleShootBubble,this),this.events.on("bubblePopped",this.hexGrid.checkForMatches,this)}handleShootBubble(t){const{direction:e,charge:s}=t,i=this.getRandomColor(),h=new n(this,this.shooterX,this.shooterY,`bubble_${i}`,i);this.bubbleGroup.add(h);const o=500*s;this.physics.velocityFromRotation(e.angle(),o,h.body.velocity),h.setCollideWorldBounds(!0),h.body.onWorldBounds=!0,this.physics.world.on("worldbounds",(t=>{t.gameObject===h&&this.placeBubbleAtBubblePosition(h)})),this.physics.add.overlap(this.bubbleGroup,this.bubbleGroup,this.collideCallback,void 0,this)}placeBubbleAtBubblePosition(t){this.hexGrid.placeBubbleNear(t.x,t.y,t)?this.hexGrid.checkForMatches():t.destroy()}getRandomColor(){const t=["red","blue","green"];return t[o.Math.Between(0,t.length-1)]}update(){}}const a={type:Phaser.AUTO,width:600,height:800,parent:"game-container",backgroundColor:"transparent",scale:{mode:Phaser.Scale.EXPAND,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[c],physics:{default:"arcade",arcade:{gravity:{x:0,y:0}}}};new h.Game(a);
