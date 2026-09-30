const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
function load(relative, mocks = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const localRequire = name => mocks[name] ?? (name.startsWith('@/') ? load('src/' + name.slice(2) + '.ts') : require(name));
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports;
}
const { cloudinaryImageLoader: loader, isCloudinaryImage } = load('src/lib/cloudinary-image.ts');
const { validateImageFiles } = load('src/lib/image-upload-limits.ts');
const StoreImage = load('src/components/ui/image/StoreImage.tsx').default;
const base = 'https://res.cloudinary.com/demo/image/upload/';
assert.equal(loader({src: base + 'a_90/v123/folder/photo.webp', width: 640}), base + 'a_90/c_limit,w_640,f_auto,q_auto/v123/folder/photo.webp');
assert.equal(loader({src: base + 'a_90/photo.webp', width: 320}), base + 'a_90/c_limit,w_320,f_auto,q_auto/photo.webp');
assert.equal(loader({src: base + 'v123/photo.webp?foo=bar', width: 320, quality: 80}), base + 'c_limit,w_320,f_auto,q_80/v123/photo.webp?foo=bar');
for (const src of ['/imgs/placeholder.jpg', 'blob:test', 'https://example.com/photo.jpg', base + 's--signature--/v123/photo.webp']) {
  assert.equal(isCloudinaryImage(src), false);
  assert.equal(loader({src, width: 640}), src);
}
for (const src of [base + 'v123/photo.webp', '/imgs/placeholder.jpg', base + 's--signature--/v123/photo.webp']) {
  const html = renderToStaticMarkup(React.createElement(StoreImage, {src, alt: 'test', width: 320, height: 240}));
  assert.ok(!html.includes('/_next/image'), html);
  if (isCloudinaryImage(src)) assert.ok(html.includes('c_limit,w_') && html.includes('srcSet='), html);
  else assert.ok(html.includes(src) && !html.includes('srcSet='), html);
}
const file = (size, type = 'image/jpeg') => ({size, type});
const mb = 1024 * 1024;
assert.equal(validateImageFiles([file(2 * mb)]), null);
assert.ok(validateImageFiles([file(2 * mb + 1)]));
assert.equal(validateImageFiles(Array(4).fill(file(2 * mb))), null);
assert.ok(validateImageFiles(Array(5).fill(file(2 * mb))));
assert.ok(validateImageFiles([file(100, 'image/svg+xml')]));
assert.ok(validateImageFiles([file(mb + 1)], mb));
console.log('OK: URLs, rotaciones, fuentes locales/firmadas, HTML sin optimizador Next y límites de subida.');

async function checkProductUploads() {
  let role = 'admin', uploads = 0, active = 0, peak = 0, requests = 0, fail = false;
  const action = load('src/actions/product/create-update-product.ts', {
    '@/auth.config': { auth: async () => ({user: {role, token: 'test-only'}}) },
    'next/cache': { revalidatePath() {} },
    '@/lib/upload-store-image': { uploadStoreImage: async () => {
      uploads++; active++; peak = Math.max(peak, active);
      await new Promise(resolve => setImmediate(resolve));
      active--;
      if (fail) throw new Error('Simulated upload failure');
      return 'https://example.com/test.webp';
    } },
  }).createUpdateProduct;
  const form = count => {
    const fd = new FormData();
    for (const [key,value] of Object.entries({title:'Producto de prueba',slug:'prueba',description:'Prueba',price:'10',inStock:'1'})) fd.set(key,value);
    for(let i=0;i<count;i++) fd.append('images',new Blob(['test'],{type:'image/jpeg'}),'test.jpg');
    return fd;
  };
  const originalFetch = global.fetch;
  const originalError = console.error;
  global.fetch = async () => { requests++; return {ok:true,json:async()=>({slug:'prueba',images:[]})}; };
  try {
    role = 'user';
    assert.equal((await action(form(1))).ok,false);
    assert.equal(uploads,0);
    role = 'admin';
    assert.equal((await action(form(6))).ok,false);
    assert.equal(uploads,0);
    assert.equal((await action(form(3))).ok,true);
    assert.equal(peak,1);
    assert.equal(requests,1);
    fail = true;
    console.error = () => {};
    assert.equal((await action(form(2))).ok,false);
    assert.equal(requests,1,'No guardar el producto si falla una subida');
  } finally { global.fetch = originalFetch; console.error = originalError; }
  console.log('OK: autorización, cantidad máxima, subidas secuenciales y fallo sin guardar producto (servicios simulados).');
}
checkProductUploads().catch(error => { console.error(error); process.exitCode = 1; });
