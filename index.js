'use strict';

const STORE = {
  items: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }
  ],
  checkboxChecked: false
} ;


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <span class="js-shopping-item-edit hidden"><input class="edit-bar" value=${item.name}></input><button class="edit-button">OK</button></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  
  let filteredItems = [...STORE.items];
  if(STORE.checkboxChecked) {
    filteredItems = filteredItems.filter(item => item.checked === false);
  }
  if($('.js-searchbar').val() !== '') {
    filteredItems = filteredItems.filter(item => item.name.includes($('.js-searchbar').val()));
  }
  
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}


function handleSearch(){
  //this function will be responsible for when users want to search for an item
  //and will display all items containing the search term(s)
  $('#searchbar-filter').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewSearch` ran');
    const newSearch = $('.js-searchbar').val();
    console.log(newSearch);
    renderShoppingList();
  });
}

function toggleCheckbox() {
  //this function will be responsible for handling when the checkbox is checked/unchecked
  //and updating the boolean in STORE as such
  $('.js-checkbox').click(event => {
    console.log('`toggleCheckbox` ran');
    STORE.checkboxChecked = !STORE.checkboxChecked;
    renderShoppingList();
  });
}

function saveChange(itemIndex) {
  $('.js-shopping-list').on('click', '.edit-button', event => {
    STORE.items[itemIndex] = $('.edit-bar').val();
  });
}

function handleEditItemClicked() {
  // we attach the event listener on the element
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {

    // look for the current/clicked-on item and find the input and remove hidden
    $(event.target).closest('li').find('.js-shopping-item-edit').toggleClass('hidden');
    // look for the current item and find the `item` and hide it
    $(event.target).closest('li').find('.js-shopping-item').toggleClass('hidden');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    saveChange(itemIndex);
    // renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSearch();
  toggleCheckbox();
  handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);