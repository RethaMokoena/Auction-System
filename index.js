const socket = io();
const auction = document.getElementById('auction');

// Login Function
const login = () => {
    const form = document.createElement('form');
    form.id = 'loginForm';
    
    const heading = document.createElement('h2');
    heading.innerText = 'Login';
    form.appendChild(heading);

    // Dynamic Username field
    const userL = document.createElement('label');
    userL.setAttribute('for', 'username');
    userL.innerText = 'Username:';

    const userN = document.createElement('input');
    userN.type = 'text';
    userN.id = 'username';
    userN.name = 'username';
    userN.required = true;
    userL.appendChild(userN);
    form.appendChild(userL);

    // Dynamic Password field
    const passwordL = document.createElement('label');
    passwordL.setAttribute('for', 'password');
    passwordL.innerText = 'Password:';

    const passwordN = document.createElement('input');
    passwordN.type = 'password';
    passwordN.id = 'password';
    passwordN.name = 'password';
    passwordN.required = true;
    passwordL.appendChild(passwordN);
    form.appendChild(passwordL);

    // Submit Button
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.innerText = 'Login';

    // submit form
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        const usernameValue = document.getElementById("username").value;
        const passwordValue = document.getElementById("password").value;
        const loginData = {Name: usernameValue, Password:passwordValue};
        loginFunction(loginData);
    });
    form.appendChild(submit);
    auction.appendChild(form);
}
login();

// After the user has logged in
const auctionHome = (data) => {

    // header information section
    const user = document.createElement('div');
    user.id = 'userInformation';

    const details = document.createElement('div');
    details.id = 'detail';

    // user icon
    const userIcon = document.createElement('i');
    userIcon.classList.add('fas', 'fa-user');
    details.appendChild(userIcon);

    details.appendChild(document.createTextNode(data.username));
    user.appendChild(details);

    // Create an auction
    const homeUI = document.createElement('div');
    homeUI.id = 'homeUI';

    // Create Auction Button 
    const createAuction = document.createElement('button');
    createAuction.type = 'submit';
    // plus icon
    const plusIcon = document.createElement('i');
    plusIcon.classList.add('fas', 'fa-plus-circle');
    // text
    const createAuctiontextNode = document.createTextNode('Create Auction');

    createAuction.appendChild(plusIcon);
    createAuction.appendChild(createAuctiontextNode);

    createAuction.addEventListener('click', (e) => {
        e.preventDefault();
        CreateAuction(data);
    });
    homeUI.appendChild(createAuction);

    // Join Auction Button 
    const joinAuction = document.createElement('button');
    joinAuction.type = 'submit';
    // sign icon
    const signIcon = document.createElement('i');
    signIcon.classList.add('fas', 'fa-sign-in-alt');
    // text
    const joinAuctiontextNode = document.createTextNode('Join Auction');

    joinAuction.appendChild(signIcon);
    joinAuction.appendChild(joinAuctiontextNode);
    joinAuction.addEventListener('click', (e) => {
        e.preventDefault();
        socket.emit('get', data);    
    });
    homeUI.appendChild(joinAuction);

    auction.innerHTML = '';
    auction.appendChild(user);
    auction.appendChild(homeUI);
}

const CreateAuction = (data) => {

    const user = header(data);

    // Create Auction form
    const form = document.createElement("form");
    form.id = 'auctionform';

    const heading = document.createElement('h2');
    heading.innerText = 'Create Auction';
    form.appendChild(heading);

    // name
    const inputName = document.createElement('div');
    inputName.id = 'inputstyle';

    const nameL = document.createElement("label");
    nameL.setAttribute("for", "auctionname");
    nameL.textContent = "Name:";
    inputName.appendChild(nameL);

    const auction_name = document.createElement("input");
    auction_name.setAttribute("type", "text");
    auction_name.setAttribute("id", "auctionname");
    auction_name.setAttribute("placeholder", "Enter Auction Name");
    auction_name.setAttribute("required", "true");

    inputName.appendChild(auction_name);
    form.appendChild(inputName);

    // start date and time
    const inputStart = document.createElement('div');
    inputStart.id = 'inputstyle';

    const startDateL = document.createElement("label");
    startDateL.setAttribute("for", "start_date");
    startDateL.textContent = "Start Date:";
    inputStart.appendChild(startDateL);

    const startDate = document.createElement("input");
    startDate.setAttribute("type", "datetime-local");
    startDate.setAttribute("id", "start_date");
    startDate.setAttribute("name", "start_date");
    startDate.setAttribute("required", "true");

    inputStart.appendChild(startDate);
    form.appendChild(inputStart);

    // end date and time
    const inputEnd = document.createElement('div');
    inputEnd.id = 'inputstyle';

    const endDateL = document.createElement("label");
    endDateL.setAttribute("for", "end_date");
    endDateL.textContent = "End Date:";
    inputEnd.appendChild(endDateL);

    const endDate = document.createElement("input");
    endDate.setAttribute("type", "datetime-local");
    endDate.setAttribute("id", "end_date");
    endDate.setAttribute("name", "end_date");
    endDate.setAttribute("required", "true");
    inputEnd.appendChild(endDate);
    form.appendChild(inputEnd);

    // Title
    const inputTitle = document.createElement('div');
    inputTitle.id = 'inputstyle';

    const titleL = document.createElement("label");
    titleL.setAttribute("for", "title");
    titleL.textContent = "Title:";
    inputTitle.appendChild(titleL);

    const title = document.createElement("input");
    title.setAttribute("type", "text");
    title.setAttribute("id", "title");
    title.setAttribute("name", "title");
    title.setAttribute("placeholder", "Enter Property Title");
    title.setAttribute("required", "true");
    inputTitle.appendChild(title);
    form.appendChild(inputTitle);

    // Price
    const inputPrice = document.createElement('div');
    inputPrice.id = 'inputstyle';

    const priceL = document.createElement("label");
    priceL.setAttribute("for", "price");
    priceL.textContent = "Price:";
    inputPrice.appendChild(priceL);

    const price = document.createElement("input");
    price.setAttribute("type", "text");
    price.setAttribute("id", "price");
    price.setAttribute("name", "price");
    price.setAttribute("placeholder", "Enter Property Price");
    price.setAttribute("required", "true");
    inputPrice.appendChild(price);
    form.appendChild(inputPrice);

    // Location
    const inputLocation = document.createElement('div');
    inputLocation.id = 'inputstyle';

    const locationL = document.createElement("label");
    locationL.setAttribute("for", "location");
    locationL.textContent = "Location:";
    inputLocation.appendChild(locationL);

    const location = document.createElement("input");
    location.setAttribute("type", "text");
    location.setAttribute("id", "location");
    location.setAttribute("name", "location");
    location.setAttribute("placeholder", "Enter Property Location");
    location.setAttribute("required", "true");
    inputLocation.appendChild(location);
    form.appendChild(inputLocation);

    // Bedrooms
    const inputBedrooms = document.createElement('div');
    inputBedrooms.id = 'inputstyle';

    const bedroomsL = document.createElement("label");
    bedroomsL.setAttribute("for", "bedrooms");
    bedroomsL.textContent = "Bedrooms:";
    inputBedrooms.appendChild(bedroomsL);

    const bedrooms = document.createElement("input");
    bedrooms.setAttribute("type", "number");
    bedrooms.setAttribute("id", "bedrooms");
    bedrooms.setAttribute("name", "bedrooms");
    bedrooms.setAttribute("placeholder", "Enter Number of Bedrooms");
    bedrooms.setAttribute("required", "true");
    inputBedrooms.appendChild(bedrooms);
    form.appendChild(inputBedrooms);

    //  Bathrooms
    const inputBathrooms = document.createElement('div');
    inputBathrooms.id = 'inputstyle';

    const bathroomsL = document.createElement("label");
    bathroomsL.setAttribute("for", "bathrooms");
    bathroomsL.textContent = "Bathrooms:";
    inputBathrooms.appendChild(bathroomsL);

    const bathrooms = document.createElement("input");
    bathrooms.setAttribute("type", "number");
    bathrooms.setAttribute("id", "bathrooms");
    bathrooms.setAttribute("name", "bathrooms");
    bathrooms.setAttribute("placeholder", "Enter Number of Bathrooms");
    bathrooms.setAttribute("required", "true");
    inputBathrooms.appendChild(bathrooms);
    form.appendChild(inputBathrooms);

    // ParkingSpaces
    const inputParkingSpaces = document.createElement('div');
    inputParkingSpaces.id = 'inputstyle';

    const parkingSpacesL = document.createElement("label");
    parkingSpacesL.setAttribute("for", "parkingSpaces");
    parkingSpacesL.textContent = "ParkingSpaces:";
    inputParkingSpaces.appendChild(parkingSpacesL);

    const parkingSpaces = document.createElement("input");
    parkingSpaces.setAttribute("type", "number");
    parkingSpaces.setAttribute("id", "parkingSpaces");
    parkingSpaces.setAttribute("name", "parkingSpaces");
    parkingSpaces.setAttribute("placeholder", "Enter Number of ParkingSpaces");
    parkingSpaces.setAttribute("required", "true");
    inputParkingSpaces.appendChild(parkingSpaces);
    form.appendChild(inputParkingSpaces);

    // Amenities
    const inputAmenities = document.createElement('div');
    inputAmenities.id = 'inputstyle';

    const amenitiesL = document.createElement("label");
    amenitiesL.setAttribute("for", "amenities");
    amenitiesL.textContent = "Amenities:";
    inputAmenities.appendChild(amenitiesL);

    const amenities = document.createElement("textarea");
    amenities.setAttribute("id", "amenities");
    amenities.setAttribute("name", "amenities");
    amenities.setAttribute("required", "true");
    inputAmenities.appendChild(amenities);
    form.appendChild(inputAmenities);

    // Short Description
    const inputShortDescription = document.createElement('div');
    inputShortDescription.id = 'inputstyle';

    const shortDescriptionL = document.createElement("label");
    shortDescriptionL.setAttribute("for", "shortDescription");
    shortDescriptionL.textContent = "Short Description:";
    inputShortDescription.appendChild(shortDescriptionL);

    const shortDescription = document.createElement("textarea");
    shortDescription.setAttribute("id", "shortDescription");
    shortDescription.setAttribute("name", "shortDescription");
    shortDescription.setAttribute("required", "true");
    inputShortDescription.appendChild(shortDescription);
    form.appendChild(inputShortDescription);
    
    // Image
    const inputImage = document.createElement('div');
    inputImage.id = 'inputstyle';

    const imageL = document.createElement("label");
    imageL.setAttribute("for", "image");
    imageL.textContent = "Image:";
    inputImage.appendChild(imageL);

    const image = document.createElement("input");
    image.setAttribute("type", "text");
    image.setAttribute("id", "image");
    image.setAttribute("name", "image");
    image.setAttribute("placeholder", "Enter Link Image");
    image.setAttribute("required", "true");
    inputImage.appendChild(image);
    form.appendChild(inputImage);

    // Submit Button
    const submitAuction = document.createElement('button');
    submitAuction.type = 'submit';
    submitAuction.innerText = 'Submit';

    // submit form
    submitAuction.addEventListener('click', (e) => {
        e.preventDefault();
        const auctionnameValue = document.getElementById("auctionname").value;
        const startDateValue = document.getElementById("start_date").value;
        const endDateValue = document.getElementById("end_date").value;
        const titleValue = document.getElementById("title").value;
        const priceValue = document.getElementById("price").value;
        const locationValue = document.getElementById("location").value;
        const bedroomsValue = document.getElementById("bedrooms").value;
        const bathroomsValue = document.getElementById("bathrooms").value;
        const parkingSpacesValue = document.getElementById("parkingSpaces").value;
        const amenitiesValue = document.getElementById("amenities").value;
        const shortDescriptionValue = document.getElementById("shortDescription").value;
        const imageValue = document.getElementById('image').value;
        const id = data.id;
        const username = data.username;
        
        const createV = {
            auctionnameValue, 
            'start_date': startDateValue,
            'end_date': endDateValue,
            'title': titleValue,
            'price': priceValue,
            'location': locationValue,
            'bedrooms': bedroomsValue,
            'bathrooms': bathroomsValue,
            'parking_spaces': parkingSpacesValue,
            'amenities': amenitiesValue,
            'short_description': shortDescriptionValue,
            'image': imageValue,
            'user_id': id,
            username,
            id
        };
        createAuction(createV); 
    });
    form.appendChild(submitAuction);

    auction.innerHTML = '';
    auction.appendChild(user);
    auction.appendChild(form);
}

socket.on('create', data => {
    auctionHome(data);
});

socket.on('broadcast', (data) => {
    const broadcast = document.createElement('div');
    broadcast.id = 'notify';
    const notifying = document.createElement('p');
    notifying.textContent = data;
    broadcast.appendChild(notifying);

    auction.innerHTML = '';
    auction.appendChild(broadcast);
});

socket.on('login', (data) => {
    auctionHome(data);
});

const createAuction = (data) => {
    socket.emit('create', data);
}

socket.on("get", (data) => {
    joinauction(data.arrayAuction,data.userData);
})

const loginFunction = (data) => {
    socket.emit('login', data);
}

socket.on('movebid', data => {
    bidding(data);
});

const joinauction = (dataArr, data) => {

    const user = header(data);

    const join_auction = document.createElement('div');
    join_auction.id = 'join_auction';
    
    for (let index = 0; index < dataArr.length; index++) {
        // card
        const card = document.createElement('div');
        card.id = 'card';
        const img = document.createElement('img');
        img.src = dataArr[index].image;
        card.appendChild(img);

        const rightblock = document.createElement('div');
        rightblock.id = 'rightblock';

        const topInform = document.createElement('div');
        topInform.id = 'topInform';

        const name = document.createElement('p');
        name.textContent = 'Name: ' + dataArr[index].name;
        topInform.appendChild(name);

        const start = document.createElement('p');
        start.textContent = 'Start: ' + dataArr[index].start_date;
        topInform.appendChild(start);

        const end = document.createElement('p');
        end.textContent = 'End: ' + dataArr[index].end_date;
        topInform.appendChild(end);
        rightblock.appendChild(topInform);

        const secondTopInform = document.createElement('div');
        secondTopInform.id = 'secondTopInform';

        const title = document.createElement('p');
        title.textContent = 'Title: ' + dataArr[index].title;
        secondTopInform.appendChild(title);

        const price = document.createElement('p');
        price.textContent = 'Price: R' + dataArr[index].price;
        secondTopInform.appendChild(price);

        const location = document.createElement('p');
        location.textContent = 'Location:' + dataArr[index].location;
        secondTopInform.appendChild(location);

        const bedrooms = document.createElement('p');
        bedrooms.textContent = 'Bedrooms:' + dataArr[index].bedrooms;
        secondTopInform.appendChild(bedrooms);


        const bathrooms = document.createElement('p');
        bathrooms.textContent = 'Bathrooms:' + dataArr[index].bathrooms;
        secondTopInform.appendChild(bathrooms);

        const parking_spaces = document.createElement('p');
        parking_spaces.textContent = 'Parking Spaces:' + dataArr[index].parking_spaces;
        secondTopInform.appendChild(parking_spaces);
        rightblock.appendChild(secondTopInform);

        const thirdTopInform = document.createElement('div');
        thirdTopInform.id = 'thirdTopInform';

        const amenities = document.createElement('p');
        amenities.textContent = 'Amenities:';
        thirdTopInform.appendChild(amenities);

        const amenitiesDescript = document.createElement('p');
        amenitiesDescript.textContent = dataArr[index].amenities;
        thirdTopInform.appendChild(amenitiesDescript);
        rightblock.appendChild(thirdTopInform);

        const thirdTopInformOne = document.createElement('div');
        thirdTopInformOne.id = 'thirdTopInform';

        const short_description = document.createElement('p');
        short_description.textContent = 'Short Description:';
        thirdTopInformOne.appendChild(short_description);

        const short_descriptions = document.createElement('p');
        short_descriptions.textContent = dataArr[index].short_description;
        thirdTopInformOne.appendChild(short_descriptions);
        rightblock.appendChild(thirdTopInformOne);

        const joinbtn = document.createElement('div');
        joinbtn.id = 'joinbtn';

        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.innerText = 'Join';
        joinbtn.appendChild(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            join_auctionbtn({...data, 'userid' : data.id, 'Auctionid' :dataArr[index].auctionid});
        });

        rightblock.appendChild(joinbtn);

        card.appendChild(rightblock);
        join_auction.appendChild(card);
    }

    auction.innerHTML = '';
    auction.appendChild(user);
    auction.appendChild(join_auction);
}

const join_auctionbtn = (data) => {
    socket.emit('join', data);
}

const header = (data) => {
    // header information section
    const user = document.createElement('div');
    user.id = 'userInformationOne';

    const backArrow = document.createElement('button');
    backArrow.type = 'submit';

    // back arrow icon
    const backArrowIcon = document.createElement('i');
    backArrowIcon.classList.add('fas', 'fa-arrow-left');
    backArrow.appendChild(backArrowIcon);

    backArrowIcon.addEventListener('click', (e) => {
        e.preventDefault();
        auctionHome(data);
    });
    user.appendChild(backArrowIcon);

    const details = document.createElement('div');
    details.id = 'detail';

    // user icon
    const userIcon = document.createElement('i');
    userIcon.classList.add('fas', 'fa-user');
    details.appendChild(userIcon);

    details.appendChild(document.createTextNode(data.username));
    user.appendChild(details);
    return user;
}

socket.on('biddings', data => {
    document.getElementById("current-bidder").innerText = "Current-bidder:"+ data.username +" Price:R" + data.Price;
})

socket.on('highestBidder', data =>{
    document.getElementById("current-bidder").innerText = "Highest Bid: " + data.username;
});

const bidding = (data) => {
    const container = document.createElement('div');
    container.id = 'container';

    const title = document.createElement('h1');
    title.textContent = 'Auction Bidding';
    container.appendChild(title);

    const bidder_info = document.createElement('div');
    bidder_info.id = 'bidder-info';

    const current_bidder = document.createElement('p');
    current_bidder.id = 'current-bidder';
    current_bidder.textContent ="";
    bidder_info.appendChild(current_bidder);
    container.appendChild(bidder_info);

    const bid_section = document.createElement('div');
    bid_section.id = 'bid-section';

    const bid_amount = document.createElement("input");
    bid_amount.setAttribute("type", "number");
    bid_amount.setAttribute("id", "bid-amount");
    bid_amount.setAttribute("placeholder", "Enter Bid Amount");
    bid_section.appendChild(bid_amount);
    

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = "Make Bid";

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const Price = document.getElementById("bid-amount").value;
        socket.emit('bid', {...data, Price});
    });
    bid_section.appendChild(btn);
    container.appendChild(bid_section);

    auction.innerHTML = '';
    auction.appendChild(container);

}