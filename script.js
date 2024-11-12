$(document).ready(function(){
    // Näytä tai piilota kuva klikkaamalla kategoriaotsikkoa
    $(".category-card h3").click(function() {
        $(this).siblings("img").slideToggle(500); // Näyttää/piilottaa kuvan liukuefektillä
    });
    loadList();

    // Lisää tuote ostoslistalle
    $("#addProduct").click(function(){
        let product = $("#productInput").val().trim();
        let quantity = parseInt($("#quantityInput").val(), 10);
        let category = $("#categorySelect").val();

        if(product && category !== "Valitse luokka" && quantity > 0) {
            addProductToList(product, quantity, category);
            saveList();
            console.log(`Tuote lisätty: ${product}, Määrä: ${quantity}, Kategoria: ${category}`);
            $("#productInput").val('');
            $("#quantityInput").val('1');
            $("#categorySelect").val('Valitse luokka');
        } else {
            alert('Hupsis! Taisit unohtaa täyttää kentät huolellisesti!');
        }
    });

    
    // Poista valitut tuotteet kategoriasta
    $(".remove-selected").click(function(){
        let category = $(this).closest(".category-card").attr("id");
        $(this).siblings(".product-list").find("input[type='checkbox']:checked").each(function(){
            $(this).closest(".product-item").fadeOut(2000, function(){ // Poistetaan tuote hitaasti FadeOut-menetelmällä
                $(this).remove();
            });
        });
        saveList();
    });
});

function addProductToList(product, quantity, category){
    // Luo tuote-elementti piilotettuna
    let productItem = $(`
        <div class="product-item" style="display: none;">
            <input type="checkbox" class="mr-2">
            <span>${product} (${quantity} kpl)</span>
        </div>
    `);
    
    // Lisää tuote listaan ja käynnistä fadeIn-efekti
    $(`#${category} .product-list`).append(productItem);
    productItem.fadeIn(2000); // hidas fadeIn-efekti 2000millisekuntia
}
    

function saveList(){
    let list = {};
    $(".category-card").each(function(){
        let category = $(this).attr('id');
        list[category] = [];
        $(this).find(".product-item").each(function(){
            let productText = $(this).find("span").text();
            let [product, quantityText] = productText.split(" (");
            let quantity = parseInt(quantityText);
            list[category].push({ name: product.trim(), quantity: quantity });
        });
    });
    localStorage.setItem('shoppingList', JSON.stringify(list));
}

function loadList(){
    let list = JSON.parse(localStorage.getItem('shoppingList'));
    if(list){
        for(let category in list){
            if (Array.isArray(list[category])){
                list[category].forEach(function(item){
                    if (item && item.name && item.quantity) {
                        addProductToList(item.name, item.quantity, category);
                        console.log(`Ladattu tuote: ${item.name}, Määrä: ${item.quantity}, Kategoria: ${category}`);
                    }
                });
            }
        }
    }
}

// Lataa joululistanappi, joka lataa tuotteet JSON-tiedostosta
document.getElementById("loadProducts").addEventListener("click", function() {
fetch("products.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Verkkovirhe, tuotteiden lataaminen epäonnistui");
        }
        return response.json(); // Parsii JSON-datan
    })
    .then(data => {
        data.forEach(item => {
            addProductToList(item.name, item.quantity, item.category); // Lisää jokainen tuote listaan
        });
        saveList(); // Tallenna listan tila localStorageen
    })
    .catch(error => {
        console.error("Virhe ladattaessa tuotteita:", error);
        alert("Tuotteiden lataaminen epäonnistui.");
    });

});

// Lataa peruslistanappi, joka lataa tuotteet JSON-tiedostosta
document.getElementById("loadPerus").addEventListener("click", function() {
fetch("perus.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Verkkovirhe, tuotteiden lataaminen epäonnistui");
        }
        return response.json(); // Parsii JSON-datan
    })
    .then(data => {
        data.forEach(item => {
            addProductToList(item.name, item.quantity, item.category); // Lisää jokainen tuote listaan
        });
        saveList(); // Tallenna listan tila localStorageen
    })
    .catch(error => {
        console.error("Virhe ladattaessa tuotteita:", error);
        alert("Tuotteiden lataaminen epäonnistui.");
    });
});
