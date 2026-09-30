(function(root){
'use strict';
const TYPES=['qcm','practical','open'];
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function draw(bank,rng=Math.random){
 const chosen=[];
 for(const topic of new Set(bank.map(q=>q.topic))){chosen.push(shuffle(bank.filter(q=>q.topic===topic),rng)[0]);}
 // Ensure both single and multiple-answer formats are represented.
 const multiple=shuffle(bank.filter(q=>q.correct?.length>1&&!chosen.includes(q)),rng);
 while(chosen.filter(q=>q.correct?.length>1).length<Math.min(4,bank.filter(q=>q.correct?.length>1).length)&&multiple.length)chosen.push(multiple.pop());
 chosen.push(...shuffle(bank.filter(q=>!chosen.includes(q)),rng).slice(0,40-chosen.length));
 return shuffle(chosen,rng).map(q=>({...q,order:q.options?shuffle(q.options.map((_,i)=>i),rng):undefined}));
}
function answered(q,a){return q.options?Array.isArray(a)&&a.length>0:typeof a==='string'&&a.trim().length>0;}
function point(q,a){return Array.isArray(a)&&a.length===q.correct.length&&q.correct.every(v=>a.includes(v))?1:0;}
function scores(session){return TYPES.map((type,i)=>session.phases[i].reduce((n,q)=>n+(i<2?point(q,session.answers[q.id]):Number(session.grades[q.id]??0)),0)/2);}
function validated(notes){return notes.length===3&&notes.every(n=>Number.isFinite(n)&&n>=11);}
function create(bank){return {version:1,stage:'exam',phase:0,index:0,phases:TYPES.map(t=>draw(bank[t])),answers:{},flags:{},grades:{},submitted:[false,false,false],started:new Date().toISOString()};}
const api={TYPES,shuffle,draw,answered,point,scores,validated,create};if(typeof module!=='undefined')module.exports=api;else root.ExamEngine=api;
})(typeof window!=='undefined'?window:globalThis);
