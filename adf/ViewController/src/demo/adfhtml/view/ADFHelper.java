package demo.adfhtml.view;

import javax.faces.context.FacesContext;

import oracle.adf.model.binding.DCBindingContainer;
import oracle.adf.model.binding.DCIteratorBinding;

import oracle.binding.BindingContainer;


public class ADFHelper {

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

}
