exports.handler = async (event) => {
    
    const response = {
        ...event
    }
    
    if(event.email === "rhawkey@dal.ca") {
        response.tier = "tier3";
    } else if(event.message.includes("computer") || event.message.includes("laptop") || event.message.includes("printer")) {
        response.tier = "tier2";
    } else if(event.message.includes("account") || event.message.includes("password")) {
        response.tier = "tier1";
    } else {
        response.tier = "unknown";
    }

    return response;
};
