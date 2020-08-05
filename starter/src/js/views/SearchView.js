import {elements} from './base';
export const getInput= () =>elements.searchInput.value;

export const clearInput=()=>{
    elements.searchInput.value='';
}
export const clearResults=()=>{
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
}

const createButton=(page,type)=>
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'?page-1:page+1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
                    </svg>
                    <span>Page ${type==='prev'? page-1 : page+1} </span>
                </button>
    `;


/*
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
*/
const renderButtons=(page,numResults,resPerPage)=>{
    const pages=Math.ceil(numResults/resPerPage);
   // console.log(pages);
    let button;
    if(page===1 && pages>1){
        //1.only button to go ahead
        button=createButton(page,'next');
        console.log(createButton(page,'next'));
    }else if(page<pages){
        //2.both forward and previous buttons
        button=`${createButton(page,'prev')}
                ${createButton(page,'next')}`;
    }
    else if(page===pages && pages>1){
        //3.only previous button
        button=createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

const renderRecipe=recipe=>{
    const markup=`
        <li>
                            <a class="likes__link" href="#${recipe.recipe_id}">
                                <figure class="likes__fig">
                                    <img src="${recipe.image_url}" alt="${recipe.title}">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${recipe.title}</h4>
                                    <p class="likes__author">${recipe.publisher}</p>
                                </div>
                            </a>
                        </li>
`;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}

export const renderResults=(recipes,page=1,resPerPage=10)=>{
    const start=(page-1)*resPerPage;
    const end=page*resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    
    //1.render buttons
    renderButtons(page,recipes.length,resPerPage);
}