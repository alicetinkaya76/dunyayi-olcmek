import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
export default function Formula({tex}){return <div className="formula" dangerouslySetInnerHTML={{__html:katex.renderToString(tex||'',{throwOnError:false,displayMode:true,output:'htmlAndMathml'})}}/>}
