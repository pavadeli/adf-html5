package demo.adfhtml.view;

import javax.faces.context.FacesContext;

import oracle.adf.model.binding.DCBindingContainer;
import oracle.adf.model.binding.DCIteratorBinding;
import oracle.adf.share.logging.ADFLogger;

import oracle.binding.BindingContainer;

import oracle.jbo.ViewObject;
import oracle.jbo.domain.Number;


public class MatchHelperBean {
    
    private oracle.jbo.domain.Number selectedMatchId;
    private String filteringTags;
    
    
    ADFLogger _logger = ADFLogger.createADFLogger(this.getClass());
    public MatchHelperBean() {
        super();
    }

    public void setSelectedMatchId(Number selectedMatchId) {
        _logger.warning("Match has been selected ");
        _logger.info("Match has been selected "+(selectedMatchId==null?"null": selectedMatchId.toString()));
              this.selectedMatchId = selectedMatchId;
    }

    public Number getSelectedMatchId() {
        _logger.fine("MatchId has been retrieved;now log with the current match id ");
        if (selectedMatchId!=null) {
        _logger.fine("MatchId has been retrieved "+selectedMatchId==null?"null": selectedMatchId.toString());
        }
        return selectedMatchId;
    }

    /**
     * Find an iterator binding in the current binding container by name.
     *
     * @param name iterator binding name
     * @return iterator binding
     */
    public static DCIteratorBinding findIterator(String name) {
        DCIteratorBinding iter =
            getDCBindingContainer().findIteratorBinding(name);
        if (iter == null) {
           // throw new IteratorNotFound("Iterator '" + name + "' not found");
        }
        return iter;
    }
    
//    public static DCIteratorBinding findIterator(String bindingContainer,
//                                                 String iterator) {
//        DCBindingContainer bindings =
//            (DCBindingContainer)JsfUtils.resolveExpression("#{" +
//                                                           bindingContainer +
//                                                           "}");
//        if (bindings == null) {
//            throw new RuntimeException("Binding container '" +
//                                       bindingContainer + "' not found");
//        }
//        DCIteratorBinding iter = bindings.findIteratorBinding(iterator);
//        if (iter == null) {
//            throw new RuntimeException("Iterator '" + iterator +
//                                       "' not found");
//        }
//        return iter;
//    }
    
    /**
        * Return the current page's binding container.
        * @return the current page's binding container
        */
       public static BindingContainer getBindingContainer() {
           // return (BindingContainer)JSFUtils.resolveExpression("#{bindings}");
           FacesContext fc = FacesContext.getCurrentInstance();
           BindingContainer bindings =
               (BindingContainer)fc.getApplication().evaluateExpressionGet(fc,
                                                                           "#{bindings}",
                                                                           BindingContainer.class);
           return bindings;
       }

       /**
        * Return the Binding Container as a DCBindingContainer.
        * @return current binding container as a DCBindingContainer
        */
       public static DCBindingContainer getDCBindingContainer() {
           return (DCBindingContainer)getBindingContainer();
       }

    public void setFilteringTags(String filteringTags) {
        _logger.warning("filtering tag selection has been updated to"+filteringTags+"; go and refresh bind variables ");
        this.filteringTags = filteringTags;

        // get reference to the parent view object via the iterator binding
        DCIteratorBinding iter = findIterator("RemainingMatches1Iterator");
        ViewObject remainingMatchesVO = iter.getViewObject();
        // set bind parameter value on parent view object
        remainingMatchesVO.ensureVariableManager().setVariableValue("b_selected_tags",      filteringTags); 
        iter.executeQuery();

        // get reference to the parent view object via the iterator binding
        DCIteratorBinding iterTags = findIterator("RemainingTagCloudViewObj1Iterator");
        ViewObject remainingTagCloudVO = iterTags.getViewObject();
        // set bind parameter value on parent view object
        remainingTagCloudVO.ensureVariableManager().setVariableValue("b_selected_tags",      filteringTags); 
        iterTags.executeQuery();

    }

    public String getFilteringTags() {
        return filteringTags;
    }
}
