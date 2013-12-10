(function($){var maxfps=25,delay=1/maxfps*1000,lastRender=new Date().getTime(),layers=[],plaxActivityTarget=$(window),motionDegrees=30,motionMax=1,motionMin=-1,motionStartX=null,motionStartY=null,ignoreMoveable=false
$.fn.plaxify=function(params){return this.each(function(){var layerExistsAt=-1
var layer={"xRange":$(this).data('xrange')||0,"yRange":$(this).data('yrange')||0,"invert":$(this).data('invert')||false,"background":$(this).data('background')||false}
for(var i=0;i<layers.length;i++){if(this===layers[i].obj.get(0)){layerExistsAt=i}}
for(var param in params){if(layer[param]==0){layer[param]=params[param]}}
layer.inversionFactor=(layer.invert?-1:1)
layer.obj=$(this)
if(layer.background){pos=(layer.obj.css('background-position')||"0px 0px").split(/ /)
if(pos.length!=2){return}
x=pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/)
y=pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/)
if(!x||!y){return}
layer.originX=layer.startX=x[2]||0
layer.originY=layer.startY=y[2]||0}else{var position=layer.obj.position()
layer.obj.css({'top':position.top,'left':position.left,'right':'','bottom':''})
layer.originX=layer.startX=position.left
layer.originY=layer.startY=position.top}
layer.startX-=layer.inversionFactor*Math.floor(layer.xRange/2)
layer.startY-=layer.inversionFactor*Math.floor(layer.yRange/2)
if(layerExistsAt>=0){layers.splice(layerExistsAt,1,layer)}else{layers.push(layer)}})}
function moveable(){return(ignoreMoveable==true)?false:window.DeviceOrientationEvent!=undefined}
function valuesFromMotion(e){x=e.gamma
y=e.beta
if(Math.abs(window.orientation)===90){var a=x;x=y;y=a;}
if(window.orientation<0){x=-x;y=-y;}
motionStartX=(motionStartX==null)?x:motionStartX
motionStartY=(motionStartY==null)?y:motionStartY
return{x:x-motionStartX,y:y-motionStartY}}
function plaxifier(e){if(new Date().getTime()<lastRender+delay)return
lastRender=new Date().getTime()
var leftOffset=(plaxActivityTarget.offset()!=null)?plaxActivityTarget.offset().left:0,topOffset=(plaxActivityTarget.offset()!=null)?plaxActivityTarget.offset().top:0,x=e.pageX-leftOffset,y=e.pageY-topOffset
if(x<0||x>plaxActivityTarget.width()||y<0||y>plaxActivityTarget.height())return
if(moveable()){if(e.gamma==undefined){ignoreMoveable=true
return}
values=valuesFromMotion(e)
x=values.x/motionDegrees
y=values.y/motionDegrees
x=x<motionMin?motionMin:(x>motionMax?motionMax:x)
y=y<motionMin?motionMin:(y>motionMax?motionMax:y)
x=(x+1)/2
y=(y+1)/2}
var hRatio=x/((moveable()==true)?motionMax:plaxActivityTarget.width()),vRatio=y/((moveable()==true)?motionMax:plaxActivityTarget.height()),layer,i
for(i=layers.length;i--;){layer=layers[i]
newX=layer.startX+layer.inversionFactor*(layer.xRange*hRatio)
newY=layer.startY+layer.inversionFactor*(layer.yRange*vRatio)
if(layer.background){layer.obj.css('background-position',newX+'px '+newY+'px')}else{layer.obj.css('left',newX).css('top',newY)}}}
$.plax={enable:function(opts){if(opts){if(opts.activityTarget)plaxActivityTarget=opts.activityTarget||$(window)
if(typeof opts.gyroRange==='number'&&opts.gyroRange>0)motionDegrees=opts.gyroRange}
$(document).bind('mousemove.plax',function(e){plaxifier(e)})
if(moveable()){window.ondeviceorientation=function(e){plaxifier(e)}}},disable:function(opts){$(document).unbind('mousemove.plax')
window.ondeviceorientation=undefined
if(opts&&typeof opts.restorePositions==='boolean'&&opts.restorePositions){for(var i=layers.length;i--;){layer=layers[i]
if(layers[i].background){layer.obj.css('background-position',layer.originX+'px '+layer.originY+'px')}else{layer.obj.css('left',layer.originX).css('top',layer.originY)}}}
if(opts&&typeof opts.clearLayers==='boolean'&&opts.clearLayers)layers=[]}}
if(typeof ender!=='undefined'){$.ender($.fn,true)}})(function(){return typeof jQuery!=='undefined'?jQuery:ender}());