
/**
 * @param { Function } fun the function which is to be promisified
 * @return {Function} the promisified function is returned
 */

prmisify=function(fun){
  return function(){
    return new Promise((resolve,reject)=>{
    fun(...arguments,(err,data)=>{
      if(err) reject(err);
      else resolve(data)
    })
  })
}
}



/*=======================================
      example usage
========================================*/
/*
* const mk=prmisify(fs.mkdir);
* mk('./data1').then(()=>{
*  console.log('done')
* })
* /

