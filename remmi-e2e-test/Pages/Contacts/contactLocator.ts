import { Page, Locator } from '@playwright/test';

export class ContactLocators {
  constructor(private page: Page) {}

  // ─── Navigation ───────────────────────────────────────────────────────────

  Contacts(): Locator {
    return this.page.locator("//li[@data-label='Contacts']");
  }

  Settings(): Locator {
    return this.page.locator('li[data-label="Settings"]');
  }

  // ─── Search & Reset ───────────────────────────────────────────────────────

  SearchBox(): Locator {
    return this.page.locator('#keywordInput');
  }

  ResetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset' });
  }

  // ─── Contact Type Dropdown ────────────────────────────────────────────────

  ContactTypeDropdown(): Locator {
    return this.page.locator(
      "//re-multiselect[@placeholder='Contact Type']//div[@class='tags']"
    );
  }

  SearchContactType(): Locator {
    return this.page.locator(
      're-multiselect[placeholder="Contact Type"] input[placeholder="Search"]'
    );
  }

  SelectOption(): Locator {
    return this.page.locator("//li[@class='p-element ng-star-inserted']").first();
  }

  SelectAllTypes(): Locator {
    return this.page.locator('.checkbox__checkmark').first();
  }

  DeSelectAllTypes(): Locator {
    return this.page.locator('.checkbox__checkmark').first();
  }

  // ─── Company Type Dropdown ────────────────────────────────────────────────

  CompanyType(): Locator {
    return this.page.locator("//span[normalize-space()='Company Type']");
  }

  SearchCompanyType(): Locator {
    return this.page.locator('input[placeholder="Search"]').last();
  }

  SelectCompanyOption(): Locator {
    return this.page.locator("//li[@class='p-element ng-star-inserted']").first();
  }

  // ─── Table ────────────────────────────────────────────────────────────────

  TableFirstRow(): Locator {
    return this.page.locator('table tbody tr').first();
  }

  TableRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  TableHeaderCells(): Locator {
    return this.page.locator('table thead tr th');
  }

  NoContactsAvailableCell(): Locator {
    return this.page.getByRole('cell', { name: 'No contacts available' });
  }

  // ─── Checkbox & Delete ────────────────────────────────────────────────────

  CheckBox(): Locator {
    return this.page.getByRole('checkbox');
  }

  RowCheckbox(): Locator {
    return this.page.locator('.p-checkbox-box.p-component').first();
  }

  SelectAllCheckbox(): Locator {
    return this.page.locator('.p-checkbox-box').first();
  }

  DeleteIcon(): Locator {
    return this.page.locator('._circle-btn[data-help-target="contacts-bulk-delete-desktop"] > img.cursor-pointer[src="assets/img/menuIcon/delete_icon.svg"]').first();
  }

  ConfirmYesButton(): Locator {
    return this.page.getByRole('button', { name: /Yes/i });
  }

  ConfirmNoButton(): Locator {
    return this.page.getByRole('button', { name: /No/i }).first();
  }

  // ─── Deleted Contacts ─────────────────────────────────────────────────────

  DeletedContacts(): Locator {
    return this.page.getByRole('link', { name: 'Deleted Contacts' });
  }

  SearchForDeletedContact(): Locator {
    return this.page.locator('#keywordInput');
  }

  restoreContactIcon(): Locator {
    return this.page.locator('.d-flex.align-items-center.gap-3 > img').first();
  }

  // ─── Contact Creation Form ────────────────────────────────────────────────

  PlusButton(): Locator {
    return this.page.getByRole('button', { name: '' });
  }

  ContactCreationForm(): Locator {
    return this.page.locator('section.body-details');
  }

  CloseFormIcon(): Locator {
    return this.page.locator('.pi.pi-times').first();
  }

  SaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' }).first();
  }

  SaveAndCloseButton(): Locator {
    return this.page.getByRole('button', { name: 'Save & Close' }).first();
  }

  FirstNameInput(): Locator {
    return this.page.locator('input[formcontrolname="first_name"]');
  }

  LastNameInput(): Locator {
    return this.page.locator('input[formcontrolname="last_name"]');
  }

  EmailInput(): Locator {
    return this.page.locator('input[formcontrolname="email"]');
  }

  MobileInput(): Locator {
    return this.page.locator('input[formcontrolname="mobile_no"]');
  }

  ContactTypeFormDropdown(): Locator {
    return this.page.locator('span').filter({ hasText: 'Individual' });
  }

  CompanyOption(): Locator {
    return this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
  }

  InitialsPlaceholder(): Locator {
    return this.page.locator('.user-thumbnail-placeholder .text-uppercase').first();
  }

  DefaultInitialsPlaceholder(): Locator {
    return this.page.getByText('D1', { exact: true });
  }

  PreferredContactMethodDropdown(): Locator {
    return this.page.locator('div').filter({ hasText: /^Select Contact Method$/ }).nth(1);
  }

  SelectAllContactMethodCheckbox(): Locator {
    return this.page.locator('label.select_all');
  }

  DeselectAllLabel(): Locator {
    return this.page.locator('label.select_all[data="Deselect All"]');
  }

  AddEmailButton(): Locator {
    return this.page.getByRole('button', { name: '' }).nth(1);
  }

  AddPhoneButton(): Locator {
    return this.page.getByRole('button', { name: '' }).nth(2);
  }

  OtherEmailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Other Email' });
  }

  OtherPhoneInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Other Phone' });
  }

  DeleteEmailButton(): Locator {
    return this.page.getByRole('button', { name: 'delete' }).first();
  }

  DeletePhoneButton(): Locator {
    return this.page.getByRole('button', { name: 'delete' }).last();
  }

  SetPrimaryEmailButton(): Locator {
    return this.page.getByRole('button', { name: '' }).first();
  }

  // ─── Validation Errors ────────────────────────────────────────────────────

  FirstNameError(): Locator {
    return this.page.getByText(/First name is required/i, { exact: false });
  }

  CompanyNameError(): Locator {
    return this.page.getByText(/Company name is required/i, { exact: false });
  }

  EmailRequiredError(): Locator {
    return this.page.getByText(/Email is required/i, { exact: false });
  }

  InvalidEmailError(): Locator {
    return this.page.getByText('Invalid email format');
  }

  // ─── Success Toasts ───────────────────────────────────────────────────────

  ContactCreatedToast(): Locator {
    return this.page.getByText(/Contact has been created|Contact has been updated/i);
  }

  ContactDeletedToast(): Locator {
    return this.page.getByRole('alert', { name: 'Contact deleted successfully' });
  }

  // ─── Address Fields ───────────────────────────────────────────────────────

  AddressSearchInput(): Locator {
    return this.page.locator('input[placeholder="Search Address"]');
  }

  AddressSuggestionItem(): Locator {
    return this.page.locator('.pac-item').first();
  }

  AddressEditOverlayButton(): Locator {
    return this.page.locator('#toggle-overlay');
  }

  BuildingNameInput(): Locator {
    return this.page.locator('input[formcontrolname="building_name"]');
  }

  UnitNoInput(): Locator {
    return this.page.locator('input[formcontrolname="unit_no"]');
  }

  StreetNoInput(): Locator {
    return this.page.locator('input[formcontrolname="street_no"]');
  }

  StreetNameInput(): Locator {
    return this.page.locator('input[formcontrolname="street_name"]');
  }

  SuburbInput(): Locator {
    return this.page.locator(
      'p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input'
    );
  }

  StateInput(): Locator {
    return this.page.locator('input[formcontrolname="state"]');
  }

  PostCodeInput(): Locator {
    return this.page.locator('input[formcontrolname="post_code"]');
  }

  CountryInput(): Locator {
    return this.page.locator('input[formcontrolname="country"]');
  }

  AddressSaveButton(): Locator {
    return this.page.getByRole('button', { name: /^Save$/i }).last();
  }

  // ─── Tag Manager ──────────────────────────────────────────────────────────

  TagPlusIcon(): Locator {
    return this.page.locator('i.pi.pi-plus.cursor-pointer.text-primary');
  }

  TagManagerPopupHeader(): Locator {
    return this.page.getByText('Tag ManagerCompany Contact');
  }

  AddTagTypeButton(): Locator {
    return this.page.getByRole('dialog').getByRole('button', { name: '' });
  }

  TagTypeDropdownContainer(): Locator {
    return this.page.locator('.ng-select-container:has-text("Select Tag Type")');
  }

  TagTypeSearchInput(): Locator {
    return this.page
      .locator(
        '.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]'
      )
      .last();
  }

  TagNameInput(): Locator {
    return this.page.locator('input[placeholder="Add Multiple Tags"]');
  }

  TagAddButton(): Locator {
    return this.page.getByRole('button', { name: /^Add$/i });
  }

  TagCancelButton(): Locator {
    return this.page.getByRole('button', { name: /cancel/i }).first();
  }

  TagSearchInput(): Locator {
    return this.page.locator(
      'input[placeholder="Search Tag"], input[placeholder="Search Tags"]'
    );
  }

  TagCloseButton(): Locator {
    return this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)').last();
  }

  TagSuccessToast(): Locator {
    return this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2);
  }

  TagRemoveIcon(): Locator {
    return this.page.locator('.f-12.pi.pi-times.cp').first();
  }

  // ─── Contact Detail Panel ─────────────────────────────────────────────────

  ContactDetailPanel(): Locator {
    return this.page.locator('.property-details').first();
  }

  ContactDetailName(): Locator {
    return this.page.locator('.f-20.ng-star-inserted').first();
  }

  ContactDetailCloseIcon(): Locator {
    return this.page.locator('.pi.pi-times.cursor-pointer.f-14');
  }

  // ─── Status / Column Filter ───────────────────────────────────────────────

  StatusFilterButton(): Locator {
    return this.page.getByRole('img', { name: 'filter' }).first();
  }

  FilterByPopup(): Locator {
    return this.page
      .locator('div')
      .filter({ hasText: 'Filter BySelectClearApply' })
      .nth(1);
  }

  FilterSelectDropdownFirst(): Locator {
    return this.page.getByText('Select', { exact: true }).first();
  }

  FilterSelectDropdownLast(): Locator {
    return this.page.getByText('Select', { exact: true }).last();
  }

  FilterSearchByKeyword(): Locator {
    return this.page.getByRole('textbox', { name: 'Search by keyword' });
  }

  FilterApplyButton(): Locator {
    return this.page.getByRole('button', { name: /apply/i });
  }

  FilterClearButton(): Locator {
    return this.page.getByRole('button', { name: /clear/i });
  }

  FilterEqualsOption(): Locator {
    return this.page.getByRole('option', { name: /equals/i });
  }

  FilterSearchPlaceholder(): Locator {
    return this.page.getByPlaceholder('Search').last();
  }

  // ─── Stream Tab ───────────────────────────────────────────────────────────

  StreamTab(): Locator {
    return this.page.getByRole('tab', { name: /Stream/i });
  }

  StreamSearchInput(): Locator {
    return this.page.locator('input[placeholder*="Search by keyword"]').first();
  }

  StreamCards(): Locator {
    return this.page.locator('div.stream-body');
  }

  StreamCardTimestamp(): Locator {
    return this.page.locator('span.f-10.text-dark');
  }

  // ─── Task Tab ─────────────────────────────────────────────────────────────

  TasksTab(): Locator {
    return this.page.getByRole('tab', { name: /Task|Tasks/i });
  }

  AddTaskButton(): Locator {
    return this.page.getByRole('button', { name: /Add Task|New Task/i });
  }

  TaskTitleInput(): Locator {
    return this.page.locator('input[formcontrolname="title"]').first();
  }

  TaskDueDateInput(): Locator {
    return this.page.locator('p-calendar[formcontrolname="due_date"] input');
  }

  TaskAssignedUsersInput(): Locator {
    return this.page.locator('ng-select[formcontrolname="assignedUsers"] input');
  }

  TaskSaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' }).first();
  }

  TaskSuccessToast(): Locator {
    return this.page.locator('div').filter({ hasText: 'Task created' }).last();
  }

  TaskTable(): Locator {
    return this.page.locator('#customentitydatalist').last();
  }

  TaskRows(): Locator {
    return this.page.locator('#customentitydatalist table tbody tr');
  }

  TaskTypeDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
  }

  TaskStatusDropdown(): Locator {
    return this.page.locator("//ng-select[@placeholder='Select Status']//div[@role='combobox']");
  }

  TaskModuleDropdown(): Locator {
    return this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
  }

  TaskRecurringCheckbox(): Locator {
    return this.page
      .locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box')
      .first();
  }

  TaskSyncCalendarCheckbox(): Locator {
    return this.page
      .locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box')
      .last();
  }

  TaskRecurringTypeDropdown(): Locator {
    return this.page.getByText('Select Recurring Type');
  }

  TaskRecurringEndDateInput(): Locator {
    return this.page.locator('input[placeholder="dd/mm/yy"]').last();
  }

  TaskCommentInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Send comments to the Assignee' });
  }

  TaskSendCommentButton(): Locator {
    return this.page.getByRole('button', { name: 'Send Comment' });
  }

  TaskCommentPublishedToast(): Locator {
    return this.page.getByText('Comment published');
  }

  TaskCopyButton(): Locator {
    return this.page.getByRole('button', { name: /Copy Task/i }).first();
  }

  TaskCreateSubTaskButton(): Locator {
    return this.page.getByRole('button', { name: /Create SubTask/i }).first();
  }

  SubTaskTitleInput(): Locator {
    return this.page.getByRole('textbox', { name: /Enter Task Title/i });
  }

  SubTaskSaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' }).nth(1);
  }

  TaskFileInput(): Locator {
    return this.page.locator('#fileInput');
  }

  TaskAddFilesButton(): Locator {
    return this.page.getByRole('button', { name: /Add Files/i });
  }

  TaskUploadedImage(): Locator {
    return this.page.locator('.img-fluid').first();
  }

  TaskLeadNameDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="lead_id"]');
  }

  TaskUpdatedToast(): Locator {
    return this.page.locator('div').filter({ hasText: /task has been updated/i }).last();
  }

  // ─── Lead Tab ─────────────────────────────────────────────────────────────

  LeadTab(): Locator {
    return this.page.getByRole('tab', { name: /Lead/i });
  }

  NewLeadButton(): Locator {
    return this.page.getByRole('button', { name: /New Lead/i });
  }

  LeadTableRows(): Locator {
    return this.page.locator('#customentitydatalist table tbody tr');
  }

  LeadDetailsSection(): Locator {
    return this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
  }

  LeadTypeDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="lead_type"]');
  }

  LeadStatusDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="lead_status"]');
  }

  LeadSourceDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="lead_source"]');
  }

  LeadCategoryDropdown(): Locator {
    return this.page.locator('ng-select[formcontrolname="lead_category"]');
  }

  LeadAgentResponsibleDropdown(): Locator {
    return this.page.locator('[formcontrolname="agent_responsible"]');
  }

  LeadAgentResponsibleInput(): Locator {
    return this.page.locator('[formcontrolname="agent_responsible"] input');
  }

  LeadOwnerDropdown(): Locator {
    return this.page.locator('[formcontrolname="Owner"]');
  }

  LeadOwnerInput(): Locator {
    return this.page.locator('[formcontrolname="Owner"] input');
  }

  LeadSaveAndCloseButton(): Locator {
    return this.page.getByRole('button', { name: /save & close/i }).first();
  }

  LeadSaveButton(): Locator {
    return this.page.getByRole('button', { name: /save/i }).first();
  }

  LeadSuccessMessage(): Locator {
    return this.page.getByText(/lead added successfully/i);
  }

  LeadUpdatedMessage(): Locator {
    return this.page.getByText('Lead updated successfully', { exact: true });
  }

  LeadDuplicatedMessage(): Locator {
    return this.page.getByText('Duplicated', { exact: true });
  }

  LeadDuplicateIcon(): Locator {
    return this.page.locator('i[ptooltip="Duplicate"].pi.pi-clone');
  }

  LeadEditIcon(): Locator {
    return this.page.locator("//button[@class='_addNew p-2']//img[@class='cursor-pointer']");
  }

  LeadCloseModal(): Locator {
    return this.page.locator('.pi.pi-times').nth(2);
  }

  LeadCloseButton(): Locator {
    return this.page.getByRole('button', { name: /close/i }).first();
  }

  LeadRequirementsSection(): Locator {
    return this.page.locator('div.popup-gray-box:has(p:text("Requirements"))');
  }

  LeadProjectDropdown(): Locator {
    return this.page.locator('[formcontrolname="project"], [formcontrolname="listing"]');
  }

  // ─── Related Property Tab ─────────────────────────────────────────────────

  RelatedPropertyTab(): Locator {
    return this.page.locator('#pills-relatedProperty');
  }

  ListingSubTab(): Locator {
    return this.page.locator('#pills-listing0-tab');
  }

  PropertySubTab(): Locator {
    return this.page.locator('#pills-property0-tab');
  }

  ContractSubTab(): Locator {
    return this.page.getByRole('tab', { name: /Contract/i });
  }

  ListingSearchCombobox(): Locator {
    return this.page.getByRole('combobox', { name: /search listing/i });
  }

  PropertySearchCombobox(): Locator {
    return this.page.getByRole('combobox', { name: /search Property/i });
  }

  AssociateButton(): Locator {
    return this.page.locator('button.preview-btn.btn-sm.f-12:visible');
  }

  ListingAttachedToast(): Locator {
    return this.page.getByText(/listing attached successfully|Listing already associated/i).first();
  }

  PropertyAttachedToast(): Locator {
    return this.page.getByText(/property attached successfully|property already associated/i).first();
  }

  RelatedPropertyDeleteButton(): Locator {
    return this.page.getByRole('button', { name: 'delete' });
  }

  DropListCell(): Locator {
    return this.page.locator('td.cdk-drop-list[cdkdroplist]');
  }

  ContractTable(): Locator {
    return this.page.locator('table.p-datatable-table').nth(7);
  }

  // ─── Related Contact Tab ──────────────────────────────────────────────────

  RelatedContactTab(): Locator {
    return this.page.getByRole('tab', { name: /related contact/i });
  }

  RelatedContactSelectDropdown(): Locator {
    return this.page.locator('div.tags:has-text("Select")').last();
  }

  RelatedContactSearchInput(): Locator {
    return this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' });
  }

  RelatedContactAssociateButton(): Locator {
    return this.page.getByRole('button', { name: /associate/i }).last();
  }

  RelatedContactDuplicateAlert(): Locator {
    return this.page
      .getByRole('alert', { name: /user is already associate to this contact/i })
      .first();
  }

  RelatedContactAttachedToast(): Locator {
    return this.page.getByText(/Contact attached successfully/i).first();
  }

  RelatedContactDeletedToast(): Locator {
    return this.page.getByText(/Contact deleted successfully/i);
  }

  RelatedContactCreateNewOption(): Locator {
    return this.page.getByText('Create New').last();
  }

  RelatedContactSearchIcon(): Locator {
    return this.page.locator('.pi.pi-search.search');
  }

  // ─── Associations Tab ─────────────────────────────────────────────────────

  AssociationsTab(): Locator {
    return this.page.getByRole('tab', { name: /associations/i });
  }

  AccessRemmiButton(): Locator {
    return this.page.getByRole('button', { name: /access remmi/i });
  }

  PasswordLabel(): Locator {
    return this.page.getByText('Password', { exact: true });
  }

  PasswordInput(): Locator {
    return this.page.locator('label:has-text("Password") + input');
  }

  PasswordMinLengthError(): Locator {
    return this.page.getByText(/Password must be at least 12 characters/i);
  }

  // ─── Notes Tab ────────────────────────────────────────────────────────────

  NoteTab(): Locator {
    return this.page.getByRole('tab', { name: /note/i });
  }

  AddNoteButton(): Locator {
    return this.page.getByRole('button', { name: '' }).last();
  }

  NoteTitleInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Add note name or search' });
  }

  NoteEditor(): Locator {
    return this.page.locator('.editor');
  }

  NoteSaveButton(): Locator {
    return this.page.getByRole('button', { name: /Save/i }).last();
  }

  NoteUpdateButton(): Locator {
    return this.page.getByRole('button', { name: /Update/i }).last();
  }

  NoteCancelButton(): Locator {
    return this.page.getByRole('button', { name: /Cancel/i }).last();
  }

  NoteEditIcon(): Locator {
    return this.page.locator("//img[@alt='edit']").first();
  }

  NoteDeleteIcon(): Locator {
    return this.page.getByRole('img', { name: 'delete' }).first();
  }

  NoteSavedSuccessToast(): Locator {
    return this.page.getByText('Saved successfully');
  }

  NoteUpdatedSuccessToast(): Locator {
    return this.page.getByText('Updated successfully');
  }

  NoteDeletedSuccessToast(): Locator {
    return this.page.getByText(/Deleted successfully/i);
  }

  NoteOptionList(): Locator {
    return this.page.locator("//div[@class='list_ ng-star-inserted']//ul");
  }

  // ─── Notification ─────────────────────────────────────────────────────────

  NotificationDropdown(): Locator {
    return this.page.locator('#notification-dropdown');
  }

  // ─── Calendar ─────────────────────────────────────────────────────────────

  CalendarTitle(): Locator {
    return this.page.locator('.p-datepicker-title');
  }

  CalendarNextButton(): Locator {
    return this.page.locator('.p-datepicker-next');
  }

  CalendarPrevButton(): Locator {
    return this.page.locator('.p-datepicker-prev');
  }
}
