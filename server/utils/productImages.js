export const getProductImage = (brand,name)=>{
    const text=encodeURIComponent(`${brand} ${name}`)
    return `https://placehold.jp/30/3d5afe/ffffff/200x200.png?text=${text}`;
}