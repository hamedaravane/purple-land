var t=Object.defineProperty,s=(s,e,i)=>((s,e,i)=>e in s?t(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i)(s,"symbol"!=typeof e?e+"":e,i);import{r as e,g as i}from"./phaser-CKN4kaq3.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver((t=>{for(const e of t)if("childList"===e.type)for(const t of e.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&s(t)})).observe(document,{childList:!0,subtree:!0})}function s(t){if(t.ep)return;t.ep=!0;const s=function(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?s.credentials="include":"anonymous"===t.crossOrigin?s.credentials="omit":s.credentials="same-origin",s}(t);fetch(t.href,s)}}();const o=i(e());class n{constructor(t,e,i){s(this,"isPointerDown",!1),s(this,"start",null),this.scene=t,this.onTap=e,this.onDrawLine=i}setup(){this.scene.input.on("pointerdown",(t=>{this.isPointerDown=!0,this.start={x:t.x,y:t.y}})),this.scene.input.on("pointermove",(t=>{this.isPointerDown&&this.start&&this.onDrawLine&&this.onDrawLine(this.start,{x:t.x,y:t.y})})),this.scene.input.on("pointerup",(t=>{this.isPointerDown=!1,this.start&&(this.onTap({x:t.x,y:t.y}),this.start=null)}))}}class r{constructor(){s(this,"bubbles",[])}addBubble(t){this.bubbles.push(t)}getBubbles(){return this.bubbles}removePoppedBubbles(){this.bubbles=this.bubbles.filter((t=>!t.isPopped))}}class h{detectCollision(t,s,e){for(const i of e.getBubbles())if(!i.isPopped&&this.calculateDistance(i.position,t)<=i.radius+s)return i;return null}calculateDistance(t,s){const e=t.x-s.x,i=t.y-s.y;return Math.sqrt(e*e+i*i)}}class a{popMatchingColor(t,s){if(s.isPopped)return[];const e=s.color,i=new Set,o=[s];for(;o.length>0;){const s=o.pop();if(!i.has(s)){i.add(s);for(const i of t.getBubbles())if(!i.isPopped&&i.color===e){const t=s.position.x-i.position.x,e=s.position.y-i.position.y;Math.sqrt(t*t+e*e)<=1.2*(s.radius+i.radius)&&o.push(i)}}}for(const n of i)n.pop();return Array.from(i)}}class c{constructor(t,s,e,i,o,n=!0){this.id=t,this.position=s,this.direction=e,this.speed=i,this.radius=o,this.isActive=n}updatePosition(t){this.isActive&&(this.position.x+=this.direction.x*this.speed*t,this.position.y+=this.direction.y*this.speed*t)}deactivate(){this.isActive=!1}}class l{constructor(){s(this,"shots",[]),s(this,"shotIdCounter",0)}fireShot(t,s,e,i){const o=new c("shot-"+this.shotIdCounter++,{x:t.x,y:t.y},s,e,i);return this.shots.push(o),o}updateShots(t){this.shots.forEach((s=>s.updatePosition(t))),this.shots=this.shots.filter((t=>t.isActive))}deactivateShot(t){const s=this.shots.find((s=>s.id===t));s&&s.deactivate()}getActiveShots(){return this.shots.filter((t=>t.isActive))}}class u{calculateDirection(t,s){const e=s.x-t.x,i=s.y-t.y,o=Math.sqrt(e*e+i*i);return 0===o?{x:0,y:1}:{x:e/o,y:i/o}}calculateAngle(t,s){const e=s.x-t.x,i=s.y-t.y;return Math.atan2(i,e)}}class d{constructor(t,s,e,i,o=!1,n=0,r=0){this.id=t,this.color=s,this.position=e,this.radius=i,this.isPopped=o,this.rowIndex=n,this.colIndex=r}pop(){this.isPopped||(this.isPopped=!0)}updatePosition(t){this.position=t}}class p{constructor(t,s,e,i,o,n,r,h){this.shootingService=t,this.collisionService=s,this.popService=e,this.bubbleCluster=i,this.trajectoryService=o,this.shooterBubble=n,this.bubbleRadius=r,this.shotRadius=h}execute(t){const s=this.trajectoryService.calculateDirection(this.shooterBubble.position,t),e=this.shootingService.fireShot(this.shooterBubble.position,s,400,this.shotRadius),i=this.collisionService.detectCollision({x:e.position.x,y:e.position.y},e.radius,this.bubbleCluster);if(i){const t=this.popService.popMatchingColor(this.bubbleCluster,i);console.log(t),this.bubbleCluster.removePoppedBubbles()}else{const t=new d(`bubble-${Date.now()}`,this.shooterBubble.color,{x:e.position.x,y:e.position.y},this.bubbleRadius);this.bubbleCluster.addBubble(t)}this.shootingService.deactivateShot(e.id)}}class b extends o.Scene{constructor(){super({key:"MainScene"}),s(this,"bubbleCluster"),s(this,"tapShootUseCase"),s(this,"inputSystem"),s(this,"shooterBubble"),s(this,"dashLineGfx")}create(){this.bubbleCluster=new r,this.shooterBubble=new d("shooter","red",{x:400,y:50},20);const t=new l,s=new h,e=new a,i=new u;this.tapShootUseCase=new p(t,s,e,this.bubbleCluster,i,this.shooterBubble,20,10),this.dashLineGfx=this.add.graphics(),this.inputSystem=new n(this,(t=>{this.dashLineGfx.clear(),this.tapShootUseCase.execute(t)}),((t,s)=>{this.drawDashedLine(t,s)})),this.inputSystem.setup(),this.drawShooter()}drawShooter(){const t=this.add.graphics();t.fillStyle(16711680,1),t.fillCircle(this.shooterBubble.position.x,this.shooterBubble.position.y,this.shooterBubble.radius)}drawDashedLine(t,s){this.dashLineGfx.clear(),this.dashLineGfx.lineStyle(2,16777215,1);const e=s.x-t.x,i=s.y-t.y,o=Math.sqrt(e*e+i*i),n=Math.atan2(i,e);let r=t.x,h=t.y,a=o;for(;a>0;){const t=Math.min(8,a),s=r+Math.cos(n)*t,e=h+Math.sin(n)*t;this.dashLineGfx.beginPath(),this.dashLineGfx.moveTo(r,h),this.dashLineGfx.lineTo(s,e),this.dashLineGfx.strokePath(),this.dashLineGfx.closePath(),a-=12,r=s+4*Math.cos(n),h=e+4*Math.sin(n)}}}class f extends o.Scene{constructor(){super({key:"BootScene"})}preload(){}create(){this.scene.start("MainScene")}}const y={type:o.AUTO,width:600,height:800,scene:[f,b],parent:"game-container",physics:{default:"arcade",arcade:{gravity:{y:0,x:1}}}};window.addEventListener("load",(()=>{new o.Game(y)}));
