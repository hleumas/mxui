steal.plugins('phui/grid')
     .resources()
     .models()
     .controllers()
     .views()
     .then(function($){

    Phui.Grid.extend("Phui.Grid.Tree",{
        defaults: {
            indentedColumn: null
        }
    },
    {
        init : function(){
            this.depth = 0;
            var indentedColumn = this.options.indentedColumn;
            
            if(this.options.render && this.options.render[indentedColumn]){
                var oldRender = this.options.render[indentedColumn];
                
                this.options.render[indentedColumn] = function(instance){
                    var content = [];
            
                    if (instance.hasChildren()) {
                        content.push('<span class="toggle ui-icon ui-icon-triangle-1-e" style="float: left; margin-left: ');
                        content.push(instance.depth * 20);
                        content.push('px; display: block;height:12px;">');
						content.push('</span>');
                    }
                    content.push(oldRender.apply(this, arguments));
                    return content.join("");
                }
            }
            
            this._super(this.element[0], this.options)
        },
        
        ".toggle click" : function(el, ev){
            var rowEl = el.closest("tr");
            var instance = rowEl.model();
            this.options.model.findAll({parentId: instance.id}, this.callback('foundChildren', rowEl, el));
        },
        
        foundChildren : function(rowEl, toggleEl, items){
			this.depth++;
			var self = this;
            $.each(items, function(i, item){
                if(!item.depth) item.attr("depth", self.depth);
            })
            rowEl.after("//phui/grid/tree/views/rows.ejs", {
                options: this.options,
                items: items
            });
			
			toggleEl.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
        }
    })
     
})

