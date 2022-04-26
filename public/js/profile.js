Handlebars.registerHelper("ifEquals", function(conditional, options) {
    if (options.hash.desired === options.hash.type) {
      options.fn(this);
    } else {
      options.inverse(this);
    }
});