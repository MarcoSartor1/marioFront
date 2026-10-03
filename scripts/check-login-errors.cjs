const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file, mocks={}) {
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const module={exports:{}};
 new Function('require','module','exports',code)(name=>{if(name in mocks)return mocks[name];throw new Error('Unexpected import '+name);},module,module.exports);
 return module.exports;
}
const helper=load('src/lib/login-error.ts');
class AuthError extends Error {}
let failure;
const action=load('src/actions/auth/login.ts',{
 '@auth/core/errors':{AuthError},
 'next/dist/client/components/redirect':{isRedirectError:error=>error?.digest==='NEXT_REDIRECT'},
 '@/auth.config':{signIn:async()=>{if(failure)throw failure;}},
 '@/lib/login-error':helper,
}).authenticate;
(async()=>{
 const form=new FormData();
 assert.equal(await action(undefined,form),'Success');
 for(const [error,expected] of [
  [new Error('CallbackRouteError'),'AuthUnavailable'],
  [{type:'CallbackRouteError',cause:{err:new Error('RateLimitExceeded')}},'RateLimit'],
  [new Error('RateLimitExceeded'),'RateLimit'],
  [new Error('CredentialsSignin'),'CredentialsSignin'],
  [new AuthError('Configuration'),'AuthUnavailable'],
 ]){failure=error;assert.equal(await action(undefined,form),expected);}
 failure=Object.assign(new Error('redirect'),{digest:'NEXT_REDIRECT'});
 await assert.rejects(()=>action(undefined,form),error=>error===failure);
 failure=new Error('Unexpected');
 await assert.rejects(()=>action(undefined,form),error=>error===failure);
 console.log('OK: login exitoso, error beta real, causa anidada 429, credenciales, redirecciones y errores inesperados; sin red.');
})().catch(error=>{console.error(error);process.exitCode=1;});
