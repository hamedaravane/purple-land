var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{r as s,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();const o=i(s());class n extends o.Scene{constructor(){super({key:"BootScene"})}preload(){this.load.image("bg","assets/images/background/bg.png"),this.load.atlas("bubbles","assets/images/bubbles/bubbles_spritesheet.png","assets/images/bubbles/bubbles_spritesheet.json"),this.load.atlas("ui","assets/images/ui/ui.png","assets/images/ui/ui.json")}create(){this.scene.start("MainScene")}}const h={label:"pink",color:15626403},r=[{label:"orange",color:16081665},{label:"yellow",color:16109829},{label:"cyan",color:63127},{label:"light-blue",color:10150133},{label:"purple",color:9269719},{label:"pink",color:15626403}];class a extends o.GameObjects.Sprite{constructor(t,s,i,o,n=h,r=!1,a="bubbles"){super(t,s,i,a,n.label),e(this,"isShooter"),e(this,"color"),e(this,"diameter"),e(this,"gridCoordinates"),this.isShooter=r,this.color=n,this.diameter=o,this.setBubbleSize(),this.initPhysics(),this.scene.add.existing(this)}shot(t,e=600){if(!this.isShooter)return;const s=t.x-this.x,i=t.y-this.y,o=Math.sqrt(s*s+i*i);if(o>0){const t=s/o,n=i/o;this.body.setVelocity(t*e,n*e)}}setPosition(t,e){return this.scene.tweens.add({targets:this,x:t,y:e,duration:100,ease:"Power2"}),super.setPosition(t,e)}setBubbleSize(){if(this.width>0){const t=this.diameter/this.width;this.setScale(t)}else this.once(o.Loader.Events.COMPLETE,(()=>{const t=this.diameter/this.width;this.setScale(t)}))}initPhysics(){this.scene.physics.add.existing(this),this.body instanceof o.Physics.Arcade.Body&&(this.body.setCollideWorldBounds(!0),this.body.setVelocity(0,0),this.body.setBounce(1,1))}}const l={even:[[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]],odd:[[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]};function c(){const t=Math.floor(Math.random()*r.length);return{label:r[t].label,color:r[t].color}}class d extends o.GameObjects.Group{constructor(t,s,i){super(t),e(this,"rows"),e(this,"cols"),e(this,"cellWidth"),e(this,"cellHeight"),e(this,"bubbleRadius"),e(this,"grid"),this.rows=s,this.cols=i,this.cellWidth=t.scale.width/i,this.bubbleRadius=this.cellWidth/2,this.cellHeight=.866*this.cellWidth;const o=t.scale.height-100-this.cellHeight,n=Math.floor(o/this.cellHeight);this.grid=Array.from({length:n},(()=>Array(i).fill(null)))}createGrid(){for(let t=0;t<this.rows;t++){const e=t%2==0,s=e?this.bubbleRadius:0,i=this.cols-(e?1:0);for(let o=0;o<i;o++){const e=this.normalize(this.bubbleRadius+o*this.cellWidth+s),i=this.normalize(this.bubbleRadius+t*this.cellHeight),n=new a(this.scene,e,i,this.cellWidth,c());n.gridCoordinates={row:t,col:o},this.add(n),this.grid[t][o]=n}}}addBubble(t){const{row:e,col:s}=t.gridCoordinates;this.grid[e][s]=t,this.add(t)}removeBubble(t){const{row:e,col:s}=t.gridCoordinates;this.grid[e]&&this.grid[e][s]===t&&(this.grid[e][s]=null),this.remove(t,!0,!0)}popConnectedBubbles(t){const e=this.findConnectedSameColor(t);e.length>=3&&e.forEach((t=>this.removeBubble(t)))}findConnectedSameColor(t){const e=new Set,s=[];for(s.push(t),e.add(t);s.length>0;){const i=s.shift();e.add(i);const o=this.getNeighbors(i);for(const n of o)e.has(n)||n.color.label!==t.color.label||s.push(n)}return Array.from(e)}getNeighbors(t){const{row:e,col:s}=t.gridCoordinates,i=l[e%2==0?"even":"odd"],o=[];for(const[n,h]of i){const t=e+n,i=s+h;if(this.isValidCell(t,i)){const e=this.grid[t][i];e&&o.push(e)}}return o}snapBubbleToGrid(t){const{snappedX:e,snappedY:s,row:i,col:o}=this.getNearestGridPosition(t.x,t.y);t.setPosition(e,s),t.gridCoordinates={row:i,col:o},this.addBubble(t)}getNearestGridPosition(t,e){let s=Math.round((e-this.bubbleRadius)/this.cellHeight);s<0&&(s=0);const i=s%2==0;let o;o=i?Math.round(t/this.cellWidth-1):Math.round(t/this.cellWidth-.5),o<0&&(o=0);const n=i?this.cellWidth*(o+1):this.cellWidth*(o+.5),h=this.bubbleRadius+s*this.cellHeight;return{snappedX:this.normalize(n),snappedY:this.normalize(h),row:s,col:o}}getChildren(){return super.getChildren()}isValidCell(t,e){return t>=0&&t<this.rows&&e>=0&&e<this.cols}getCellWidth(){return this.cellWidth}normalize(t,e=2){return parseFloat(t.toFixed(e))}}class b extends o.GameObjects.Graphics{constructor(t,s){super(t),e(this,"origin"),e(this,"bubble"),e(this,"dashLength",10),e(this,"gapLength",5),e(this,"aimColor"),e(this,"target"),this.bubble=s,this.origin=new o.Math.Vector2(s.x,s.y),this.target=new o.Math.Vector2(0,0),this.aimColor=s.color.color,t.add.existing(this),this.registerInputListeners()}registerInputListeners(){const t=this.scene.input;t.on("pointerdown",this.onPointerDown,this),t.on("pointermove",this.onPointerMove,this),t.on("pointerup",this.onPointerUp,this)}onPointerDown(t){this.updateTarget(t),this.redrawAimingLine(t)}onPointerMove(t){t.isDown&&(this.updateTarget(t),this.redrawAimingLine(t))}onPointerUp(){this.clear(),this.target.equals(this.origin)||this.bubble.shot({x:this.target.x,y:this.target.y})}updateTarget(t){this.target.set(t.x,t.y)}redrawAimingLine(t){this.clear(),this.lineStyle(1,this.aimColor);const e=o.Math.Angle.Between(this.origin.x,this.origin.y,t.x,t.y),s=Math.sqrt(Math.pow(this.scene.scale.width,2)+Math.pow(this.scene.scale.height,2)),i=new o.Math.Vector2(t.x+Math.cos(e)*s,t.y+Math.sin(e)*s);this.drawDashedLine(this.origin,new o.Math.Vector2(t.x,t.y)),this.drawDashedLine(new o.Math.Vector2(t.x,t.y),i)}drawDashedLine(t,e){const s=o.Math.Distance.Between(t.x,t.y,e.x,e.y),i=o.Math.Angle.Between(t.x,t.y,e.x,e.y);let n=s,h=t.clone();for(;n>0;){const t=Math.min(this.dashLength,n),e=new o.Math.Vector2(h.x+Math.cos(i)*t,h.y+Math.sin(i)*t);this.moveTo(h.x,h.y),this.lineTo(e.x,e.y),h.set(e.x+Math.cos(i)*this.gapLength,e.y+Math.sin(i)*this.gapLength),n-=this.dashLength+this.gapLength}this.strokePath()}destroy(...t){const e=this.scene.input;e.off("pointerdown",this.onPointerDown,this),e.off("pointermove",this.onPointerMove,this),e.off("pointerup",this.onPointerUp,this),super.destroy(...t)}}class u{constructor(t,s,i){e(this,"scene"),e(this,"bubbleGrid"),e(this,"aimer"),e(this,"shootingBubble"),this.scene=t,this.bubbleGrid=new d(t,s,i),this.scene.add.existing(this.bubbleGrid)}createGrid(){this.bubbleGrid.createGrid()}spawnNewShootingBubble(){var t;null==(t=this.aimer)||t.destroy(),this.shootingBubble=new a(this.scene,this.scene.scale.width/2,this.scene.scale.height-100,this.bubbleGrid.getCellWidth(),c(),!0),this.aimer=new b(this.scene,this.shootingBubble)}checkCollision(){this.bubbleGrid.getChildren().forEach((t=>{this.isOverlap(this.shootingBubble,t)&&(this.shootingBubble.body.setVelocity(0,0),this.bubbleGrid.snapBubbleToGrid(this.shootingBubble),this.bubbleGrid.popConnectedBubbles(this.shootingBubble),this.spawnNewShootingBubble())}))}isOverlap(t,e){const s=t.x-e.x,i=t.y-e.y;return s*s+i*i<=t.diameter*e.diameter}}class g extends Phaser.Scene{constructor(){super({key:"GameScene"}),e(this,"bubbleManager")}create(){this.add.image(this.scale.width/2,this.scale.height/2,"bg"),this.bubbleManager=new u(this,10,14),this.bubbleManager.createGrid(),this.bubbleManager.spawnNewShootingBubble()}update(){this.bubbleManager.checkCollision()}}function p(t){const{colorStyle:e,state:s,shape:i}=t;return`${e}-${s}-${i}${t.cornerRadius?`-${t.cornerRadius}`:""}`}class m extends Phaser.GameObjects.Container{constructor(t,s,i,o,n,h){super(t,i,o),e(this,"config"),e(this,"sprite"),e(this,"text"),e(this,"callback"),this.config=n,this.callback=h,this.sprite=new Phaser.GameObjects.Sprite(t,0,0,"ui",p(this.config)),this.text=new Phaser.GameObjects.Text(t,0,-5,s,{fontFamily:"LuckiestGuy",fontSize:"20px",color:"#ffffff",align:"center",shadow:{offsetY:2,color:"#00000030",blur:0,fill:!0}}).setOrigin(.5,.5),this.add([this.sprite,this.text]),t.add.existing(this),this.setInteractive(new Phaser.Geom.Rectangle(-this.sprite.width/2,-this.sprite.height/2,this.sprite.width,this.sprite.height),Phaser.Geom.Rectangle.Contains),this.on("pointerdown",this.pressButton,this),this.on("pointerup",this.unpressedButton,this),this.on("pointerout",this.resetButton,this)}pressButton(){this.sprite.setFrame(p({...this.config,state:"pressed"})),this.text.setY(-1)}unpressedButton(){this.sprite.setFrame(p({...this.config,state:"unpressed"})),this.text.setY(-5),this.callback&&this.callback()}resetButton(){this.sprite.setFrame(p({...this.config,state:"unpressed"})),this.text.setY(-5)}}class w{constructor(t){e(this,"scene"),e(this,"screenWidth"),e(this,"screenHeight"),e(this,"bottomNavigation"),e(this,"topNavigation"),e(this,"contentContainer"),this.scene=t,this.screenWidth=this.scene.scale.width,this.screenHeight=this.scene.scale.height;const s=.12*this.screenHeight;console.log(s);const i=this.screenWidth/2,o=this.screenHeight/2;this.scene.add.image(i,o,"bg"),this.bottomNavigation=new Phaser.GameObjects.Container(this.scene,i,this.screenHeight-s/2);const n=new Phaser.GameObjects.Rectangle(this.scene,0,0,this.screenWidth,s,10066329,5).setBlendMode(Phaser.BlendModes.MULTIPLY);this.bottomNavigation.add(n);const h=[{label:"1",color:"pink"},{label:"2",color:"purple"},{label:"3",color:"blue"},{label:"4",color:"yellow"}],r=h.length,a=this.screenWidth/(r+1);h.forEach(((t,e)=>{const s=(e+1)*a-i,o=new m(this.scene,t.label,s,-10,{colorStyle:t.color,state:"unpressed",shape:"square"});this.bottomNavigation.add(o)})),this.topNavigation=new Phaser.GameObjects.Container(this.scene,i,0),this.contentContainer=new Phaser.GameObjects.Container(this.scene,i,0),this.scene.add.existing(this.bottomNavigation),this.scene.add.existing(this.topNavigation),this.scene.add.existing(this.contentContainer)}}class f extends o.Scene{constructor(){super({key:"MainScene"})}create(){new w(this)}}const y={type:o.AUTO,width:390,height:844,pixelArt:!1,title:"Purple Land",scene:[n,f,g],parent:"game-container",scale:{mode:o.Scale.RESIZE,autoCenter:o.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0},debug:!1}}};window.addEventListener("load",(()=>{new o.Game(y)}));
