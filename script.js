let cart = JSON.parse(localStorage.getItem("ayalasFamilyCart") || "[]");
let currentFilter = "all";
document.addEventListener("DOMContentLoaded", () => { renderProducts(); updateCart(); });
function money(n){ return "$" + Number(n).toFixed(2); }
function sizePrice(size, category="adult", base=24.99){
  if(category==="baby") return 12.99;
  if(category==="kids") return 19.99;
  if(size==="XL") return 35.00;
  if(size==="2XL") return 37.50;
  if(size==="3XL") return 40.00;
  const extra = {"4XL":42.50,"5XL":45.00};
  return extra[size] || base;
}
function renderProducts(){
 const grid=document.getElementById("productGrid"); if(!grid) return;
 const list=currentFilter==="all"?PRODUCTS:PRODUCTS.filter(p=>(p.collection||[]).includes(currentFilter));
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-photo">${p.badge?`<span class="badge">${escapeHtml(p.badge)}</span>`:""}<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('photo-placeholder')"></div><div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="product-meta">Design preview · Human T-shirt listing</div><label class="size-choice">Size <select id="size-${p.id}" aria-label="Choose size for ${escapeHtml(p.name)}"><option value="S">S</option><option value="M" selected>M</option><option value="L">L</option><option value="XL">XL</option><option value="2XL">2XL</option><option value="3XL">3XL</option></select></label><div class="price" id="price-${p.id}">${money(p.price)}</div><button class="add-button" onclick="addToCart(${p.id})">ADD TO CART</button></div></article>`).join("");
 document.querySelectorAll(".size-choice select").forEach(sel=>sel.addEventListener("change",()=>{const id=Number(sel.id.split("-")[1]);const p=PRODUCTS.find(x=>x.id===id);document.getElementById(`price-${id}`).textContent=money(sizePrice(sel.value,p.category,p.price));}));
 document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"));
 const active=[...document.querySelectorAll(".filters button")].find(b=>{const t=b.textContent.toLowerCase();return currentFilter==="all"?t.includes("all designs"):t.includes(({gaming:"gaming",funny:"funny",baby:"pastel",dogs:"dog-themed"})[currentFilter]||currentFilter)});if(active)active.classList.add("active");
}
function filterProducts(category){currentFilter=category;renderProducts();document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;const size=document.getElementById(`size-${id}`)?.value||"M";const price=sizePrice(size,p.category,p.price);const key=`${id}-${size}`;const item=cart.find(x=>x.key===key);if(item)item.qty++;else cart.push({key,id,name:p.name,image:p.image,size,price,qty:1});saveCart();openCart();}
function removeFromCart(key){cart=cart.filter(x=>x.key!==key);saveCart();}
function changeQty(key,delta){const x=cart.find(i=>i.key===key);if(!x)return;x.qty+=delta;if(x.qty<=0)removeFromCart(key);else saveCart();}
function saveCart(){localStorage.setItem("ayalasFamilyCart",JSON.stringify(cart));updateCart();}
function updateCart(){const count=document.getElementById("cartCount");if(count)count.textContent=cart.reduce((a,x)=>a+x.qty,0);const box=document.getElementById("cartItems");if(!box)return;box.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${x.image}" alt=""><div><h4>${escapeHtml(x.name)}</h4><p>Size ${escapeHtml(x.size)} · ${money(x.price)} × ${x.qty}</p><p><button onclick="changeQty('${x.key}',-1)">−</button> &nbsp; ${x.qty} &nbsp; <button onclick="changeQty('${x.key}',1)">+</button></p></div><button class="remove" onclick="removeFromCart('${x.key}')">Remove</button></div>`).join(""):'<div style="padding:35px 0;text-align:center;color:#777;font-size:12px">Your cart is empty.</div>';const total=document.getElementById("cartTotal");if(total)total.textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));}
function openCart(){document.getElementById("cartDrawer")?.classList.add("open");document.getElementById("overlay")?.classList.add("open");}
function closeCart(){document.getElementById("cartDrawer")?.classList.remove("open");document.getElementById("overlay")?.classList.remove("open");}
function toggleMenu(){document.getElementById("mobileNav")?.classList.toggle("show");}
function focusSearch(){document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});document.querySelector(".filters button")?.focus();}
function checkout(provider){const url=PAYMENT_LINKS?.[provider];if(!url){alert("Checkout is not connected yet. Add a real hosted checkout link in products.js before accepting payments. Do not collect card details on this page.");return;}window.location.href=url;}
function subscribe(e){e.preventDefault();alert("Email signup is a preview only and is not connected to an email service yet.");e.target.reset();}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
