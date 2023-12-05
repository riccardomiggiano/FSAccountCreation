/*global QUnit*/

sap.ui.define([
	"zfsaccountcreation/controller/MainWizard.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MainWizard Controller");

	QUnit.test("I should test the MainWizard controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
