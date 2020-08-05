

import axios from 'axios';
export default class Recipe{
    constructor(id){
        this.id=id;
    }
    async getRecipe(){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`); 
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;
            
            //console.log(res);
        }
        catch(error){
            alert(error);
        }
    }
    calcTime(){
    const numIng=this.ingredients.length;
    const periods=Math.ceil(numIng/3);
    this.time=periods*15;
}
    calcServings(){
        this.servings=4;
    }
    
    parseIngredients(){
        const longUnits=['tablespoons','tablespoon','ounces','ounce','cups','teaspoons','teaspoon','pounds'];
        const shortUnits=['tbsp','tbsp','oz','oz','cup','tsp','tsp','pound'];
        const units=[...shortUnits,'kg','g'];
        const newIngredients=this.ingredients.map(el=>{
            // uniform units
            let ingredient=el.toLowerCase();
            longUnits.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,shortUnits[i]);
            })
            //remove brackets
            ingredient=ingredient.replace(/ *\([^)]*\) */g, " ");
            //parse ingredients
            const arrIng=ingredient.split(' ');
            const unitIndex=arrIng.findIndex(el2=>units.includes(el2));
            let objIng;
            if(unitIndex>-1){
                // unit is present
                const arrCount=arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length==1){
                    count=eval(arrIng[0].replace('-','+'));
                }else{
                    count=eval(arrIng.slice(0,unitIndex).join('+'));
                }
                
                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
            }
            else if(parseInt(arrIng[0],10)){
                //no unit but a nummber is present
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' ')
                    
                }
            }
            else if(unitIndex===-1){
                //no unit and no number
                objIng={
                    count:1,
                    unit:'',
                    ingredient
                       }
            }
            return objIng;
        });
        this.ingredients=newIngredients;
    }
    updateServings(type){
        //servings
        const newServings=type==='dec'?this.servings-1:this.servings+1;
        
        //ingredients
        this.ingredients.forEach(el=>{
            el.count=el.count*(newServings/this.servings);
        })
        this.servings=newServings;
    }
}

