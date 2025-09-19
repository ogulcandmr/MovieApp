const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");
const apiLink = 'http://localhost:8000/api/v1/reviews/';


const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle

// Yeni yorum formu
const div_new = document.createElement('div');
div_new.innerHTML = `
<div class="row">
    <div class="column">
        <div class="card">
            New Review
            <p><strong>Review: </strong>
            <input type="text" id="new_review" value="">
            </p>
            <p><strong>User: </strong>
            <input type="text" id="new_user" value="">
            </p>
            <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a>
            </p>
        </div>    
    </div> 
</div>`;
main.appendChild(div_new);

// Yorumları getir
returnReviews();

function returnReviews(){
    fetch(apiLink + "movie/" + Number(movieId))
    .then(res => res.json())
    .then(function(data){
        console.log(data);
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return;
        }
        data.forEach(review => {
            const div_card = document.createElement('div');
            div_card.innerHTML = `
            <div class="row">
                <div class="column">
                    <div class="card" id="${review._id}">
                        <p><strong>Review: </strong>${review.review}</p>
                        <p><strong>User: </strong>${review.user}</p>
                        <p>
                            <a href="#" onclick="editReview('${review._id}','${review.review}','${review.user}')">✏️</a> 
                            <a href="#" onclick="deleteReview('${review._id}')">🗑️</a>
                        </p>
                    </div>    
                </div> 
            </div>`;
            main.appendChild(div_card);
        });
    }); 
}

function editReview(id, review, user) {
    const element = document.getElementById(id);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
    <p><strong>Review: </strong>
        <input type="text" id="${reviewInputId}" value="${review}">
    </p>
    <p><strong>User: </strong>    
        <input type="text" id="${userInputId}" value="${user}">
    </p>
    <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a>
    </p>`;
}

function saveReview(reviewInputId, userInputId, id="") {
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    if(id) {
        // Update review
        fetch(apiLink + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({user, review})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            location.reload();
        });
    } else {
        // Add new review (POST)
        fetch(apiLink + "new", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({user, review, movieId: Number(movieId)})
})
        .then(res => res.json())
        .then(res => {
            console.log(res)
            location.reload();
        });
    }
}

function deleteReview(id) {
    fetch(apiLink + id, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        location.reload();
    });
}