/*jshint node:true*/
module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		/* Autoprefixer */
		autoprefixer: {
			options: {
				browsers: ['last 3 version', 'ie 8', 'ie 7']	
			},
			single_file: {
				src: 'css/index.css',
				dest: 'css/index.prefixed.css'
			}
		},
		borschik: {
			options: {
				minimize: true
			},
			css: {
				src: ['css/index.prefixed.css'],
				dest: ['css/index.min.css']
			},
			js: {
				src: ['js/geo.js'],
				dest: ['js/geo.min.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-borschik');
	grunt.registerTask('default', ['autoprefixer', 'borschik']);
};