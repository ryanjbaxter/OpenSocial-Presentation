/***********************************************************************************************************************
 *
 * OpenSocial SlideContainer
 * ==========================================
 *
 * Copyright (C) 2012 by Ryan Baxter (http://ryanjbaxter.com)
 *
 ***********************************************************************************************************************
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 ***********************************************************************************************************************/


var org = org || {};
org.opensocial = org.opensocial || {};

org.opensocial.slidepageOpen = false;

org.opensocial.presentationGadget = 'http://localhost:8080/slidecontainer/gadget/opensocial-pres.xml';

org.opensocial.SlideContainer = function() {
  var config = {};
  config[osapi.container.ContainerConfig.RENDER_DEBUG] = '1';
  this.container = new osapi.container.Container(config);
  this.container.views.createElementForGadget = this.createElementForGadget;
  this.container.views.destroyElement = this.destroyElement();
  this.container.actions.registerShowActionsHandler(this.drawActions());
};

org.opensocial.SlideContainer.prototype.loadGadget = function() {
  var self = this;
  this.container.preloadGadget(org.opensocial.presentationGadget, 
          function(metadata) {
    var theGadgetElement = $('#theGadgetSite').get(0);
    var site = self.container.newGadgetSite(theGadgetElement);
    var renderParams = {};
    renderParams[osapi.container.RenderParam.HEIGHT] = '100%';
    renderParams[osapi.container.RenderParam.WIDTH] = '100%';
    renderParams[osapi.container.RenderParam.VIEW] = 'canvas';

    var viewParams = {
      'foo' : 'bar',
      'number' : 123,
      'object' : {
        'MWLUG' : 'ROCKS!'
      }
    };
    self.container.navigateGadget(site, org.opensocial.presentationGadget, viewParams, 
      renderParams);
  });
  
};

org.opensocial.SlideContainer.prototype.createElementForGadget = function(metadata, rel, opt_view, opt_viewTarget,
        opt_coordinates) {
  $('#gadgetModal').modal();
  return $('#gadgetModalBody').get(0);
};

org.opensocial.SlideContainer.prototype.destroyElement = function() {
  var self = this;      
  return function(site) {
    self.container.closeGadget(site);
    $('#gadgetModal').modal('hide');
  };
};

org.opensocial.SlideContainer.prototype.drawActions = function() {
  var self = this;
  return function(actions) {
    var action = actions[0];
    var actionHtml = '<li id="' + action.id + '"><a href="#">' + action.label + '</a></li>';
    var actionObj = $(actionHtml);
    actionObj.click(function(event){
      self.container.actions.runAction(action.id);
    });
    $('#actionsList').append(actionObj);
  };
};

org.opensocial.SlideContainer.prototype.setPersonSelection = function(person) {
  var selection = {};
  selection['type'] = 'opensocial.person';
  selection['data'] = person;
  this.container.selection.setSelection([selection]);
}


$(document).ready(function() {
  var slideContainer = new org.opensocial.SlideContainer();
  slideContainer.loadGadget();
  
  $('#pageSlide').click(function(event) {
    $('#chevron').removeClass('icon-chevron-left icon-chevron-right');
    if(!org.opensocial.slidepageOpen) {
      $('#chevron').addClass('icon-chevron-left');
    } else {
      $('#chevron').addClass('icon-chevron-right');
    }
    org.opensocial.slidepageOpen = !org.opensocial.slidepageOpen;
    $.pageslide({href: "#pageSlideContent"});
    
  });
  
  $('.person').click(function(event){
    var person = {};
    person['id'] = $(this).attr('id');
    person['displayName'] = $(this).html();
    slideContainer.setPersonSelection(person);
  });
});
