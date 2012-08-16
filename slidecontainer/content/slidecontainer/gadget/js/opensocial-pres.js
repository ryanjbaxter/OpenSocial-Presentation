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

gadgets.util.registerOnLoadHandler(function(){
  Reveal.initialize({
    // Display controls in the bottom right corner
    controls: true,

    // Display a presentation progress bar
    progress: false,

    // Push each slide change to the browser history
    history: false,

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Loop the presentation
    loop: false,

    // Number of milliseconds between automatically proceeding to the 
    // next slide, disabled when set to 0
    autoSlide: 0,

    // Enable slide navigation via mouse wheel
    mouseWheel: false,

    // Apply a 3D roll to links on hover
    rollingLinks: true,

    // UI style
    theme: 'default', // default/neon/beige

    // Transition style
    transition: 'default' // default/cube/page/concave/linear(2d)
  });

  hljs.initHighlightingOnLoad();

  if(gadgets.util.hasFeature('actions')) {
    gadgets.actions.updateAction({
      id: "org.opensocial.slides.showWeather",
      callback: weatherAction
    });
  }

  if(gadgets.util.hasFeature('selection')) {
    gadgets.selection.addListener(selectionListener);
  }

});

/**
 * This function demonstrates how to use the
 * getCurrentView API. 
 */
function getCurrentView() {
  var view = gadgets.views.getCurrentView();
  alert('The current view is: ' + view.getName());
  return false;
};

/**
 * This function demonstrates how to get the
 * view params.
 */
function getViewParams() {
  var params = gadgets.views.getParams();
  alert('View params passed to the gadget: ' + gadgets.json.stringify(params));
  return false;
};

function getStringParam() {
  var prefs = new gadgets.Prefs();
  alert(prefs.getString('myname'));
  return false;
};

function setNameParam() {
  var prefs = new gadgets.Prefs();
  var nameValue = document.getElementById('namePrefValue').value;
  prefs.set('myname', nameValue);
  document.getElementById('namePrefValue').value = '';
  return false;
};

/**
 *  Sample makeRequest.
 */
function makeRequestExample(domId) {
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest('http://weather.yahooapis.com/forecastjson?w=2473224', function(response){
    if(response.errors.length == 0) {
      var weather = document.getElementById(domId);
      var html = '<div>Current Temp: ' + response.data.condition.temperature + ' F</div>';
      html  =  html +'<div><img src="' + response.data.condition.image + '"/></div>';
      weather.innerHTML = html;
      weather.setAttribute('class', 'alert alert-success');
    } else {
      gadgets.error('There was an error making the request.');
    }
  }, params);
  return false;
};

function oauthExample() {
  var params = {};
  params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH2;
  params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = 'googleAPI';
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest('https://www.googleapis.com/plus/v1/people/me', function(response) {
    if (response.oauthApprovalUrl) {
      var onOpen = function() {};
      var onClose = function() {
        oauthExample();
      };
      var popup = new gadgets.oauth.Popup(response.oauthApprovalUrl, null, onOpen, onClose);
      var click = popup.createOpenerOnClick();
      click();
    } else if (response.data) {
      var person = response.data;
      var profile = document.getElementById('profileInfo');
      var html = '<div class="alert alert-success"><div><img src="' + person.image.url + '" height="75" width="75"/><div><div><a href="' + person.url + '" target="_blank">' + person.displayName + '</a></div><div>Organizations: ';
      for (var i = (person.organizations.length - 1); i >= 0; i -= 1) { 
        if(i > 0) {
          html = html + person.organizations[i].name + ', ';
        } else {
          html = html + person.organizations[i].name;
        }
      }
      html = html + '</div></div><div>Places Lived: ';
      for (var i = (person.placesLived.length - 1); i >= 0; i -= 1) {
        if(i > 0) {
          html = html + person.placesLived[i].value + ', ';
        } else {
          html = html + person.placesLived[i].value;
        }
      }
      profile.innerHTML = html;
    } else {
      gadgets.error('something went wrong');
    }
  }, params);
};

function openView() {
  var params = {};
  params['view'] = 'dialog'
  gadgets.views.openGadget(function(result){
    document.getElementById('answer').innerHTML = result;
    document.getElementById('answerWrapper').setAttribute('style', '');
    document.getElementById('answerWrapper').setAttribute('class', 'alert alert-success');
  }, function(metadata){}, params);
};

function weatherAction() {
  makeRequestExample('actionWeather');
};

function selectionListener(selection) {
  //Only print out the first selected object, even though there could be more
  var html = '<div class="alert alert-success">' + selection[0].data.displayName + '</div>';
  document.getElementById('selectionContainer').innerHTML = html;
};