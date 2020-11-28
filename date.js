//we do not add parenteses under a module export because we do not want call it here
// we let app.js decides when to call
//if you would like to call multiple functions you will need to follow the code below
//for a single function just simply type module.exports = getDate; or whatever the function is called.

//module.exports.getDate = getDate;
//module.exports.getDay = getDay; 




exports.getDate = function(){
    
    const date = new Date();

    const options ={
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return date.toLocaleDateString("en-US", options);
};

exports.getDay = function(){
    
    const date = new Date();

    const options ={
        weekday: "long"
    };

    return date.toLocaleDateString("en-US", options);
};
