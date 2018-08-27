---
title: GreatLeaderSelector
permalink: 
---

var MarcoCMYK = ['GreatLeaderC.svg','GreatLeaderM.svg','GreatLeaderY.svg','GreatLeaderK.svg','GreatLeaderR.svg','GreatLeaderG.svg','GreatLeaderB.svg']
var MarcoSVGimg = MarcoCMYK[Math.floor(Math.random() * MarcoCMYK.length)];

MarcoSrc = '{{site.url}}{{site.baseurl}}/img/'+MarcoSVGimg

document.getElementById("Chairman").src = MarcoSrc
