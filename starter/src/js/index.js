import Search from './models/Search';
import * as SearchView from './views/SearchView';
import * as recipeView from './views/recipeView';

import {elements,renderLoader,removeLoader} from './views/base';
import Recipe from './models/Recipes'; 


/*Global state of the app
-search object
-current recipe
-shopping list object
-liked recipes
*/

const state={};
//SEARCH CONTROLLER
const controlSearch=async()=>{
    //1.Get query from view
    const query=SearchView.getInput();
    
    if(query){
        //2. New search object and add to state
        state.search=new Search(query);
        try{
            //3. Prepare UI for results
        SearchView.clearInput();
        SearchView.clearResults();
        renderLoader(elements.searchRes);   
        //4.search for recipes
        await state.search.getResult();
        
        //5.Render results on UI
        removeLoader();
        SearchView.renderResults(state.search.result);
    }
        catch(error){
            alert(error);
        }
        }
        
}
elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
   //console.log(btn);
    if(btn){
        const goTo=parseInt(btn.dataset.goto,10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result,goTo);
        //console.log(goTo);
    }
});


// RECIPE CONTROLLER
const controlRecipe=async ()=>{
    const id=window.location.hash.replace('#','');
    console.log(id);
    if(id){
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //create new recipe object
        state.recipe=new Recipe(id);
        
        try{
            // get recipe data
        await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        //calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        // render recipe
            removeLoader();
            recipeView.renderRecipe(state.recipe);
        }
        catch(error){
            alert(error);
        }
    }
}
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load',controlRecipe);


//handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1){
        //decrease servings
        state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
    }
    }else if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    console.log(state.recipe);
});
















