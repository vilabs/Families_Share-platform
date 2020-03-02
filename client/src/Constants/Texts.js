/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
const React = require("react");

const en = {
  participantsModal: {
    header: "Participants",
    cancel: "Close"
  },
  managePlanSolution: {
    needsHeader: "SLOT NEEDS",
    selectFrom: "Select availabilities from",
    participating: "Plan participating members",
    available: "Slot available members",
    all: "All group members"
  },
  createPlanScreen: { backNavTitle: "New Planning" },
  groupManagementScreen: {
    backNavTitle: "Group Management",
    totalVolunteers: "Total number of Volunteers",
    totalKids: "Total number of kids",
    totalEvents: "Total number of events",
    totalCompletedEvents: "Total number of completed events",
    metricsHeader: "Group Metrics",
    metricsColumn: "Metric",
    valuesColumn: "Value",
    chartHeader: "Total contribution per user"
  },
  timeslotEmergencyScreen: {
    copy: "Copied emergency number to clipboard",
    call: "Call",
    header: "Emergency Numbers:",
    services: {
      general: "General Emergency",
      ambulance: "Ambulance",
      police: "Police",
      fire: "Fire Department"
    }
  },
  editPlanScreen: {
    requiredErr: "Please fill out this field.",
    learning: "learning or educational activities/homework",
    nature: "nature",
    tourism: "tourism and culture",
    hobby: "hobby and sport",
    accompanying: "accompanying(car sharing or pedibus)",
    entertainment: "entertainment",
    parties: "parties or events",
    coplaying: "co-playing day(s)",
    other: "other",
    category: "Type of activity",
    backNavTitle: "Edit Plan",
    ratio: "Children to parents ratio",
    minVolunteers: "Minimum Volunteers",
    deadline: "Deadline",
    needsState: "Provide Needs",
    availabilitiesState: "Provide Availabilities",
    planningState: "Create Plan",
    creationState: "Create Activities",
    state: "Plan State",
    needsStateHelper:
      "In needs phase the users select the dates that they will need childcare. In this state availabilities phase is locked.",
    availabilitiesStateHelper:
      "In availabilities phase the users select the dates that they are available for childcare. In this state needs phase is locked.",
    planningStateHelper:
      "In planning phase the Families Share Algorithm creates an optimal plan based on the given needs and availabilities.",
    creationStateHelper:
      "In creation phase the optimal plan gets transformed into activities."
  },
  createPlanStepper: {
    name: "Name",
    from: "From",
    to: "To",
    description: "Description",
    location: "Location",
    requiredErr: "Please fill out this field.",
    deadlineErr: "Deadline must be before the specified date range",
    rangeErr: "Invalid start and end date combination",
    continue: "Continue",
    cancel: "Cancel",
    finish: "Create",
    save: "Save",
    stepLabels: [
      "Provide a title for the planned activity",
      "Set date range",
      "Provide needs deadline",
      "Provide the location"
    ]
  },
  managePlanScreen: {
    export: "Export plan",
    edit: "Edit plan",
    delete: "Delete plan",
    exportConfirm: "Are you sure you want to export this plan?",
    exportToaster:
      "The plan is being exported in xls format. You will shorty receive it via e-mail",
    backNavTitle: "Manage Planning",
    deleteConfirm: "Are you sure you want to delete this plan?"
  },
  managePlanStepper: {
    pmTimeslotFrom: "PM timeslot from",
    pmTimeslotTo: "To",
    amTimeslotFrom: "AM timeslot From",
    amTimeslotTo: "To",
    create: "Create",
    discard: "Discard",
    activitiesCreation: "Create activities",
    automatically: "Automatically",
    manually: "Manually",
    zeroVolunteersTimeslots: "Handle timeslots with no volunteers",
    automaticSuccess: "Plan was successfully transformed to activities",
    manualSuccess:
      "You will soon receive the final solution of the plan via email",
    nextPhase: "Next phase",
    previousPhase: "Previous phase",
    finishPlan: "Create Activities",
    continue: "Continue",
    cancel: "Cancel",
    finish: "Submit",
    link: "Receive link",
    linkSuccess:
      "You will shortly receive an e-mail with the corresponding link.",
    desktopPrompt:
      "In order to edit the provided solution you need to access the platform via a desktop or a laptop.Press the button to receive an e-mail with the platforms address.",
    stepLabels: [
      "Add needs",
      "Customize needs",
      "Add availabilities",
      "Customize availabilities",
      "Manage Solution",
      "Manage activity details"
    ],
    needsDeadline: "You have to provide your needs until",
    availabilitiesDeadline: "You have to provide your availabilities until",
    availabilityError: "Missing availability for date",
    needError: "Missing child assignemnt for date",
    needsSuccess: "You have successfully added your needs",
    availabilitiesSuccess: "You have successfully added your availabilities"
  },
  planListItem: {
    participantsNeeds: "members have specified needs",
    participantNeeds: "member has specified needs",
    participantsAvailabilities: "members have specified  availabilities",
    participantAvailabilities: "member has specified availabilities",
    needsPhase: "Declaring needs",
    availabilitiesPhase: "Declaring availabilities",
    planningPhase: "Finding optimal solution",
    creationPhase: "Transforming plan to activities"
  },
  communityInterface: {
    backNavTitle: "Community Interface",
    totalNumberOfUsers: "Total number of Users",
    totalNumberOfGroups: "Total number of Groups",
    averageAppRating: "App rating",
    averageNumberOfActivitiesPerGroup: "Average number of Activities per Group",
    averageNumberOfMembersPerGroup: "Average number of Members per Group",
    totalNumberOfChildren: "Total number of Children",
    analyticsHeader: "Analytics",
    communityGrowth: "Platform user growth (%)",
    totalNumberOfGoogleSignups: "Registered using Google",
    totalNumberOfPlatformSignups:
      "Registered using the Families_Share platform",
    timeslot_autoconfirm: "Timeslots auto-confirm",
    auto_admin: "Member automatically admins",
    metricsColumn: "Metric",
    valuesColumn: "Value",
    configurationsHeader: "Configurations",
    chartsHeader: "Charts",
    charts: [
      "Total number of users",
      "Number of users registered with platform",
      "Number of users registered with google",
      "Total number of children",
      "Total number of groups",
      "Average number of group members",
      "Average number of group activities"
    ]
  },
  profileChildren: {
    addChildPrompt:
      "You haven't added any children yet. Click the child icon to add a new child"
  },
  myCalendarScreen: {
    backNavTitle: "My Calendar"
  },
  editTimeslotScreen: {
    learning: "learning or educational activities/homework",
    nature: "nature",
    tourism: "tourism and culture",
    hobby: "hobby and sport",
    accompanying: "accompanying(car sharing or pedibus)",
    entertainment: "entertainment",
    parties: "parties or events",
    coplaying: "co-playing day(s)",
    other: "other",
    category: "Type of activity",
    addTimeslotTitle: "New Timeslot",
    from: "From",
    date: "Date",
    to: "To",
    details: "Details",
    parents: "Required parents",
    children: "Required children",
    name: "Title",
    location: "Location",
    description: "Description(optional)",
    cost: "Cost(optional)",
    status: "Timeslot status",
    ongoing: "Ongoing",
    completed: "Completed",
    timeErr: "Invalid start and end time combination",
    requiredErr: "Please fill out this field.",
    rangeErr: "Please select a value greater than zero.",
    editConfirm: "Confirm edits?",
    crucialChangeConfirm:
      "If you save these edits all participants will be unsubscribed. Confirm edits?",
    deleteConfirm: "Are you sure you want to delete this timeslot?"
  },
  timeslotScreen: {
    externals: "Externals",
    externalPlaceholder: "Add external volunteer",
    externalAvailabilities: "Add external availabilities",
    allUsersAvailabilities: "Add user availabilities",
    allChildrenAvailabilities: "Add children Availabilities",
    admins: "Group Administrators",
    phoneConfirm: "Call",
    copy: "Copied number to clipboard",
    minimum: "minimum number",
    userAvailability: "Add your availability:",
    childrenAvailability: "Add your children availability:",
    volunteer: "volunteer",
    volunteers: "Volunteers",
    child: "child",
    children: "Children",
    emergency: "EMERGENCY",
    signup: "signed up",
    userSubscribe: "You have added yourself to the activity",
    userUnsubscribe: "You have removed yourself from the activity",
    parentSubscribe1: "You have added",
    parentSubscribe2: "to the activity",
    parentUnsubscribe1: "You have removed",
    parentUnsubscribe2: "from the activity",
    cannotEdit: "A timeslot cannot be editted after it has been completed",
    childSubscribe1: "You have added",
    childSubscribe2: "to the activity",
    childUnsubscribe1: "You have removed",
    childUnsubscribe2: "from the activity",
    childSubscribeConfirm1: "Are you sure you want to add",
    childSubscribeConfirm2: "to the activity?",
    childUnsubscribeConfirm1: "Are you sure you want to remove",
    childUnsubscribeConfirm2: "from the activity?",
    editConfirm: "Confirm edits?",
    you: "You",
    userSubscribeConfirm:
      "Are you sure you want to add yourself to the activity?",
    userUnsubscribeConfirm:
      "Are you sure you want to remove yourself from the activity?"
  },
  timeslotPreview: {
    confirmed: "Confirmed",
    pending: "Waiting for confirmation",
    participating: "You and your children will participate",
    parentParticipating: "You will participate",
    notParticipating: "Available for new inscriptions"
  },
  ratingModal: {
    title: "How would you like to rate Families Share?",
    rate: "Rate",
    rateInstruction:
      "Tap the number of stars you would like to give us on a scale from 1-5."
  },
  landingHeader: {
    communityName: "De Stuyverij"
  },
  landingNavbar: {
    logIn: "LOG IN",
    signUp: "SIGN UP"
  },
  aboutScreen: {
    findOutMore: "FIND OUT MORE ON THE WEBSITE",
    aboutHeader: "About the project",
    privacyPolicy: "Privacy Policy",
    familyShareSolution: "The Families_Share solution",
    firstParagraph: `Funded under the Information and Communication
		 Technologies programme of Horizon 2020’s
		 Industrial Leadership component, and its call for 
		collective awareness platforms for sustainability 
		and social innovation, the Families_Share project 
		is developing a social networking and awareness-raising
		 platform dedicated to encouraging 
		childcare and work/life balance. The platform 
		capitalises on neighbourhood networks and 
		enables citizens to come together to share tasks,
		time and skills relevant to childcare and 
		after-school education/leisure, where these have 
		become unaffordable in times of stagnation and 
			'austerity.`,
    challengeHeader: "The Challenge",
    secondParagraph:
      "Balancing work and family life has become increasingly" +
      "challenging in the last decade in Europe. " +
      "The economic crisis has had a twofold" +
      "effect, impacting labour market conditions on the" +
      "one hand, and welfare provisions on the other. As " +
      "a result, unemployment rates have risen (mainly " +
      "in male-dominated sectors), while more women " +
      "(including mothers) are working on a part-time " +
      "basis. Stable jobs can no longer be taken for " +
      "granted and precarious contracts are increasing " +
      "ly widespread, with many workers entering " +
      "re-qualification schemes and facing periods of " +
      "unemployment. A shrinking workforce of perma" +
      "nent workers is subject to augmented workloads " +
      "and longer working hours, making the balance " +
      "between work and everyday life more difficult, " +
      "and the current model unsustainable.",
    fourthParagraph:
      "The Families_Share project offers a bottom-up " +
      "solution in the form of a co-designed platform " +
      "supporting families to share time and tasks relat" +
      "ed to childcare, parenting, after-school and " +
      "leisure activities and other household tasks — " +
      "with a particular focus on low-income families. " +
      "The project also aspires to engage with the elder" +
      "ly by involving them in childcare activities and by " +
      "offering them support in shopping and adminis" +
      "trative tasks, but also by involving them in family " +
      "events. To achieve this objective, the project " +
      "borrows and integrates the concepts of time " +
      "banking, capitalising on consortium members’ " +
      "existing digital social innovations in the childcare " +
      "field. It also exploits the potential of information " +
      "and communication technology (ICT) networks to " +
      "increase participatory innovation by encouraging " +
      "self-organising neighbourhoods.",
    europeanUnionText:
      "This project has received funding from the Europian " +
      "Union's Horizon 2020 CAPS Topic: ICT-11-2017 Type of " +
      "action: IA, Grant agreement No 780783",
    backNavTitle: "About"
  },
  landingScreen: {
    suggestionsHeader: "Groups in the Community",
    cardHeader: "About the Project",
    cardInfo:
      "  The Families_Share project is developing a social networking and awareness-raising " +
      "platform dedicated to encouraging childcare and work/life balance."
  },
  logInScreen: {
    backNavTitle: "Log In",
    forgotPassword: "Forgot Password?",
    orLogInWith: "OR LOG IN WITH",
    google: "GOOGLE",
    facebook: "FACEBOOK",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    agreeWithTerms:
      "By logging in you agree with our Terms of Service and Privacy Policy"
  },
  logInForm: {
    password: "Password",
    email: "Email",
    confirm: "CONFIRM",
    authenticationErr: "Invalid email or password",
    requiredErr: "Please fill out this field",
    tooShortErr: "Please use at least 8 characters.",
    typeMismatchErr: "Please enter an email address."
  },
  signUpScreen: {
    backNavTitle: "Sign Up",
    accountQuestion: "Do you already have an account?",
    logIn: "Log In"
  },
  signUpForm: {
    email: "Email",
    givenName: "First name",
    familyName: "Last name",
    password: "Password",
    confirmPassword: "Confirm password",
    confirm: "CONFIRM",
    profileVisibility: "My profile appears in search results",
    termsPolicy: "Terms and Policy",
    phoneNumber: "Phone Number (optional)",
    confirmPasswordErr: "Passwords don't match",
    signupErr: "Another account is using ",
    acceptTermsErr: "Please accept the terms and policy",
    passwordPrompt: "Password must have at least 8 characters",
    requiredErr: "Please fill out this field",
    tooShortErr: "Please use at least 8 characters.",
    typeMismatchErr: "Please enter an email address.",
    visibilityPrompt:
      "Users will be able to search for my profile inside the app"
  },
  privacyPolicyModal: {
    privacyPolicy: (
      <div>
        <h1>Families_Share Privacy Policy</h1>
        <p>
          This Privacy Policy is meant to help you understand what information
          we collect, why we collect it, and how you can update, manage, export,
          and delete your information.
        </p>
        <ol type="i">
          <li>
            <h2>Families_Share Privacy Policy</h2>
            <p>
              Welcome to the website (the "Site") of Families_Share. This Site
              was developed to provide information about the Families_Share
              services. The Families_Share application, along with the website,
              are the "Services” for visitors and users ("you" and/or "your").
            </p>
            <p>
              This Privacy Policy sets out Families_Share’s policy with respect
              to your information, including information which identifies or
              could identify you personally (known as 'personally identifiable
              information' in the USA or 'personal data' in the European Union,
              which we'll call "Personal Data") and other information that is
              collected from visitors and users of the Services. Please read
              this privacy policy carefully so that you understand how we will
              treat your data. By using any of our Services, you confirm that
              you have read, understood and agree to this privacy policy. If you
              do not agree to this policy, please do not use any of the
              Services. If you have any queries, please email us at
              <bold> contact@families-share.eu </bold>
            </p>
          </li>
          <li>
            <h2>Who we are</h2>
            <p>
              We are: ViLabs, the Families_Share EU Project’s Responsible
              Partner for the development and maintenance of the website and of
              the Families_Share Applications and corresponding services as well
              as the project’s Data processor and Data Controller. ViLabs CY
              (“Versatile Innovations”), ECASTICA Business centre 6, Vasili
              Vryonides str. Gala Court Chambers, Limassol, Cyprus t. +30 2310
              365 188, +35 725 760 967, <bold> info@vilabs.eu </bold>. We refer
              to this team as "ViLabs", "we", "us" and/or "our".
            </p>
          </li>
          <li>
            <h2>Our legal status and applicable data privacy laws</h2>
            <p>
              ViLabs holds the role of data processor and data controller under
              the EU legislation. All personal data are collected, used, stored
              and processed in full compliance with General Data Protection
              Regulation (Regulation (UE) 679/2016 also known as “GDPR") and
              European Parliament Directive 2002/58/EC (Directive on privacy and
              electronic communications). Only the Vilabs researchers and system
              administrators will have access to the data folder. The
              Families_Share services are hosted on servers located in the
              European Union and provided by contabo (https://contabo.com/).
            </p>
          </li>
          <li>
            <h2>Information We Collect</h2>
            <p>
              When you interact with us through the Services, we collect
              Personal Data and other information from you, as further described
              below: We collect Personal Data from you when you voluntarily
              provide such information, such as when you contact us with
              inquiries, register for access to the Services or use certain
              Services.
            </p>
            <p>
              In particular, in Families_Share platform will be collecting
              information about parents, children, and childcare groups.
            </p>
            <ul>
              <li>
                <p>
                  &bull; About parents: name, family name, phone number,
                  address, email and picture/avatar.
                </p>
              </li>
              <li>
                <p>
                  &bull; About children: The Information is collected only by
                  the ones who exercise parental responsibility, and there are
                  entitled to provide the relevant information, according to the
                  relevant legislation. The information is: name, birth date,
                  gender, picture/avatar and other information directly
                  specified by parents (allergies, diseases, specific diet,
                  special need, etc.).
                </p>
              </li>
              <li>
                <p>
                  &bull; About childcare groups: the group name, group bio,
                  childcare location, childcare periods and the messages in the
                  group feed (text & picture).
                </p>
              </li>
              <li>
                <p>
                  &bull; Technical or other details about any device which you
                  use to access the Services, including device Unique Device
                  Identifier (UDID) or equivalent; your operating system,
                  browser type or other software; your hardware or mobile device
                  details (including your mobile device type and number and
                  mobile carrier details), if applicable; or other technical
                  details.
                </p>
              </li>
              <li>
                <p>
                  &bull; Details of your use of our Services: metrics
                  information about when and how you use the Services.
                </p>
              </li>
            </ul>
            <p>
              By voluntarily providing us with Personal Data, you are consenting
              to us using them in the context of the Services and in accordance
              with this Privacy Policy (art. 6, par. 1, lett. a, GDPR). By the
              way, processing personal data should also be lawful when it is
              necessary for the performance of the Services (art. 6, par. 1,
              lett. b, GDPR). Regarding special categories of personal data, you
              give explicit consent to the processing of those data as soon as
              providing them for the purposes of the Services.
            </p>
          </li>
          <li>
            <h2>Our Use of Your Personal Data and Other Information</h2>
            <p>
              Each information collected is immediately separated in (i) a part
              which contains personal (not sensitive) information (such as name,
              email, phone number, etc.) about the participants involved and
              (ii) a part which is fully anonymized (non-personally
              identifiable) and then made available to the whole consortium for
              research purposes.
            </p>
            <p>
              Personal data of participants to each CityLab will be shared
              through the app to the other members of the group for the
              Families_Share activity management, under the control of the group
              administrator. Any abuse by a member will result in the
              cancellation of her/his account.
            </p>
            <p>
              Notice that any request to be part of a group is subject to
              approval by the group administrator. Additional personal data of
              participants will be collected when necessary only for scientific
              purposes (for example, to further contacts for longitudinal
              studies) and will be deleted immediately after the completion of
              the project. Anonymized data are stored in a shared repository and
              will be maintained after the completion of the project as evidence
              for the studies and the publications.
            </p>
            <p>
              In particular, the Services may use such information and pool it
              with other information on an anonymized and generalized basis to
              track, for example, the total number of users of our Services, the
              number of visitors to each page of our Site and the domain names
              of our visitors' Internet service providers (no personal data are
              involved in such case).
            </p>
          </li>
          <li>
            <h2>Our Disclosure of Your Personal Data and Other Information</h2>
            <p>
              Anyways, Families_Share (and thus the responsible partner ViLabs)
              may disclose your Personal Data only if required to do so by law
              or in the good faith belief that such action is necessary to:
            </p>
            <ul>
              <li>
                <p> &bull; Comply with a legal obligation</p>
              </li>
              <li>
                <p>
                  &bull; Act in urgent circumstances to protect the personal
                  safety of users of the Services or the public
                </p>
              </li>
              <li>
                <p> &bull; Protect against legal liability </p>
              </li>
            </ul>
          </li>
          <li>
            <h2>Your Choices</h2>
            <p>
              You can visit the Services without providing any Personal Data. If
              you choose not to provide any Personal Data, you may not be able
              to use certain Families_Share Services.
            </p>
          </li>
          <li>
            <h2>Data collection</h2>
            <p>
              All the data come from users in signing up to the Families_Share
              platform. Most of the time, parents have to give their consent to
              the treatment of private and “sensible” information about their
              children. In particular, children information is provided by
              parents and data are collected according to the GDRP (article 8):
            </p>
            <ul>
              <li>
                <p>
                  &bull; Where point (a) of Article 6(1) applies, in relation to
                  the offer of information society services directly to a child,
                  the processing of the personal data of a child shall be lawful
                  where the child is at least 16 years old. Where the child is
                  below the age of 16 years, such processing shall be lawful
                  only if and to the extent that consent is given or authorized
                  by the holder of parental responsibility over the child.
                </p>
              </li>
              <li>
                <p>
                  &bull;The controller shall make reasonable efforts to verify
                  in such cases that consent is given or authorized by the
                  holder of parental responsibility for the child, taking into
                  consideration available technology.
                </p>
              </li>
              <li>
                <p>
                  &bull; Paragraph 1 shall not affect the general contract law
                  of the Member States such as the rules on the validity,
                  formation or effect of a contract in relation to a child.”
                </p>
              </li>
            </ul>
            <p>
              Remember also GDPR’s point 32: “Consent should be given by a clear
              affirmative act establishing a freely given, specific, informed
              and unambiguous indication of the data subject's agreement to the
              processing of personal data relating to him or her, such as by a
              written statement, including by electronic means, or an oral
              statement. This could include ticking a box when visiting an
              internet website, choosing technical settings for information
              society services or another statement or conduct which clearly
              indicates in this context the data subject’s acceptance of the
              proposed processing of his or her personal data [...] If the data
              subject's consent is to be given following a request by electronic
              means, the request must be clear, concise and not unnecessarily
              disruptive to the use of the service for which it is provided”.
            </p>
          </li>
          <li>
            <h2>Children</h2>
            <p>
              Families_Share does not knowingly collect Personal Data provided
              by the very children under the age of 16. If you are under the age
              of 16, please do not submit any Personal Data through the
              Services. We encourage parents and legal guardians to monitor
              their children's Internet usage and to help enforce our Privacy
              Policy by instructing their children never to provide Personal
              Data on the Services without their permission. If you have reason
              to believe that a child under the age of 16 has provided Personal
              Data to Families_Share through the Services, please contact us,
              and we will endeavour to delete that information from our
              databases.
            </p>
          </li>
          <li>
            <h2>Data storage and preservation strategy</h2>
            <p>
              The overall Families_Share services are offered through the cloud,
              and both the back and front end of the platform and the data is
              stored on secure and protected dedicated servers through a
              certified cloud provider, which has all the needed infrastructures
              and certifications required by the GDPR.
            </p>
            <p>
              The cloud service provider is administered by a responsible person
              from VILABS and a dedicated data protection officer – (Project
              Coordinator Prof. Agostino Cortesi, Universita Ca’Foscari Venezia,
              <bold>cortesi@unive.it</bold>), following the best practices and
              standards available.
            </p>
            <p>
              Personal data will be stored throughout the official lifecycle of
              the Families_Share EU Funded Horizon 2020 Project (until the
              31/10/2020). After the end of the official period of the project,
              the personal data of users that have not logged in their account
              for one year (365 days) will be fully deleted.
            </p>
            <p>
              The Cloud service provider protected storage facility will be
              based on redundant systems and located in the EU. Data are backed
              up daily, and a backup copy is stored again in data centres in the
              EU
            </p>
            <p>
              Access to data on the storage is subject to authentication using
              username and password managed in compliance with European
              Parliament Directive 2002/58/EC.
            </p>
            <p>
              Only the ViLabs researchers (for research purpose) and system
              administrators (for maintenance purposes) will have access to the
              data folder.
            </p>
          </li>
          <li>
            <h2>Transmission of data to third parties</h2>
            <p>
              None of the collected personal information will be shared with
              third parties. The collected information will only be used within
              the platform itself, as described above (V.)
            </p>
            <p>
              The app does not make use of the use of implicit “intents”. This
              prevents the data to be unproperly accessed by other apps
              installed on the same device.
            </p>
          </li>
          <li>
            <h2>Security</h2>
            <p>
              ViLabs takes reasonable steps to protect the Personal Data
              provided via the Services from loss, misuse, and unauthorized
              access, disclosure, alteration, or destruction. The data
              communication from/to the user will be managed through the https
              SSL-based protocol.
            </p>
            <p>
              It is your responsibility to properly protect the access to the
              device where the app is installed against unauthorized usage.
            </p>
            <p>
              Registered Families_Share users will have a username and a unique
              identifier, which enables you to access certain parts of our
              Services. You are responsible for keeping them confidential. Be
              sure do not share them with anyone else.
            </p>
          </li>
          <li>
            <h2>Your rights - Closing your account</h2>
            <p>
              EU data protection legislation gives EU citizens the right to
              access information held about them. This information is mentioned
              above and can be edited by you via the services, according to GDPR
              (art. 15-22). In addition, you have the right to rectification,
              the right to withdraw the consent given (when the consent is the
              lawful basis for personal data processing), the right to erasure
              (‘right to be forgotten’), the right to restrict processing, the
              right to data portability, the right to object to processing, the
              right not to be subject to a decision based on automated
              processing (including profiling), the right to lodge a complaint
              with a supervisory authority, the right to an effective judicial
              remedy.
            </p>
            <p>
              You may email us at <bold> contact@families-share.eu</bold>
            </p>
            <p>
              All users can alter their personal information as they wish, have
              access and can download a copy of their information and their
              participation to activities via the Families_Share application,
              while they also have the right to fully delete their account and
              all information relevant to their account.
            </p>
            <p>
              Following the cancellation of the account by the user, except in
              the case of anonymous data, there is an obligation to remove
              personal data as soon as possible, since the legal basis for
              further processing should have disappeared.
            </p>
            <p>
              You may also email us at contact@families-share.eu to request that
              we delete your personal information from our database.
            </p>
          </li>
          <li>
            <h2>Changes to the Privacy Policy</h2>
            <p>
              This Privacy Policy may change from time to time. When changes are
              made, the effective date listed below will also change
              accordingly, and the new Privacy Policy will be published online,
              while all the involved parties will receive a dedicated
              notification.
            </p>
          </li>
          <li>
            <h2>Communication </h2>
            <p>
              For any other information about us, please visit our website:
              http://www.families-share.eu
            </p>
            <p>
              Please also feel free to contact us if you have any questions
              about Families_Share’s Privacy Policy or the information practices
              of the Services.
            </p>
          </li>
          <li>
            <h2>Data Management</h2>
            <p>
              DPO: Project Coordinator Prof.Agostino Cortesi, Universita
              Ca’Foscari Venezia,<bold>cortesi@unive.it</bold>
            </p>
            <p>
              Platform Data Manager: Apostolos Vontas, ViLabs Director,{" "}
              <bold>avontas@vilabs.eu</bold>
            </p>
            <p>
              Data Controller: Apostolos Vontas, ViLabs Director,
              <bold>avontas@vilabs.eu</bold>
            </p>
          </li>
        </ol>
        <p>
          By clicking on Accept button, I confirm that I have read, understood
          and agree to the Privacy Policy above
        </p>
      </div>
    ),
    accept: "ACCEPT"
  },
  groupAbout: {
    header: "About the group",
    memberHeader: "About"
  },
  groupActivities: {
    exportConfirm: "Are you sure you want to export the group agenda?",
    activitiesHeader: "Activities of the group",
    plansHeader: "Pending plans",
    export: "Export agenda",
    newPlan: "Advanced planning",
    newActivity: "New activity"
  },
  activityListItem: {
    every: "Every",
    of: "of"
  },
  groupListItem: {
    open: "Participation to the group is open.",
    closed: "Participation to the group is closed.",
    members: "Members",
    kids: "Kids"
  },
  groupInfo: {
    contact: "CONTACT GROUP",
    contactMessage: "Copied info to clipboard",
    startGuideHeader: "Don't know where to start?",
    startGuideInfo: "Look up the 7-step start-up guide",
    join: "JOIN GROUP",
    leave: "LEAVE GROUP",
    pending: "CANCEL REQUEST",
    confirm: "Are you sure you want to leave the group?"
  },
  groupNavbar: {
    chatTab: "Chat",
    activitiesTab: "Activities",
    membersTab: "Members",
    infoTab: "About",
    calendarTab: "Calendar"
  },
  groupMembersAdminOptions: {
    invite: "Invite people",
    groupIsOpen: "The group is open",
    groupIsClosed: "The group is closed",
    requestsOpen: "Requests to join are welcome",
    requestsClosed: "Full capacity has been reached"
  },
  inviteModal: {
    memberHeader: "Invite people",
    parentHeader: "Add parent",
    framilyHeader: "Add framily",
    invite: "INVITE",
    add: "ADD",
    cancel: "CANCEL",
    search: "Search"
  },

  groupNewsNavbar: {
    parents: "PARENTS",
    children: "CHILDREN"
  },
  cardWithLink: {
    learnMore: "LEARN MORE"
  },
  memberContact: {
    administrator: "Group Administrator",
    addAdmin: "Add admin",
    removeAdmin: "Remove admin",
    removeUser: "Remove User"
  },
  startUpGuide: {
    backNavTitle: "Start up guide",
    guide: [
      { main: "Launch the initiative in your circle", secondary: "" },
      { main: "Unite the first enthousiasts", secondary: "" },
      { main: "Contact the location-line item", secondary: "" },
      { main: "Make internal appointments", secondary: "" },
      { main: "Close the agenda", secondary: "" },
      { main: "Kick-off!", secondary: "" },
      { main: "Welcome", secondary: "" }
    ]
  },
  notificationScreen: {
    backNavTitle: "Notification"
  },
  myFamiliesShareHeader: {
    confirmDialogTitle:
      "Do you want a walkthrough of the platform to be sent to your email?",
    walkthrough: "Start up guide",
    rating: "Rate us",
    header: "My Families Share",
    homeButton: "Home page",
    myProfile: "My profile",
    myCalendar: "My calendar",
    createGroup: "Create a group",
    searchGroup: "Search a group",
    inviteFriends: "Invite friends",
    faqs: "FAQs",
    about: "About",
    signOut: "Sign out",
    language: "Language",
    export: "Export my data",
    community: "Community"
  },
  myFamiliesShareScreen: {
    myGroups: "My groups",
    myActivities: "My activities",
    myNotifications: "My notifications",
    myGroupsPrompt:
      "You are not yet in a group, use the lateral menu to find one",
    myActivitiesPrompt:
      "Here you will see your future activities after you have signed up for one or more groups",
    joinPrompt: "JOIN GROUP",
    createPrompt: "CREATE GROUP"
  },
  faqsScreen: {
    backNavTitle: "FAQs"
  },
  searchGroupModal: {
    search: "Search group",
    example: "e.g. After school activities",
    results: "Results"
  },
  createGroup: {
    backNavTitle: "Create group"
  },
  createGroupStepper: {
    continue: "Continue",
    cancel: "Cancel",
    finish: "Finish",
    stepLabels: [
      "Provide a name and description",
      "Set the visibility",
      "Provide the area",
      "Provide contact information",
      "Invite people"
    ],
    contactTypes: {
      phone: "Phone",
      email: "E-mail",
      none: " - "
    },
    contactInfo: "Please fill your contact information",
    name: "Name",
    description: "Description",
    visibleGroup: "Others can find my group",
    invisibleGroup: "Others cannot find my group",
    area: "Area",
    invite: "Add members",
    nameErr: "Group name already exists",
    requiredErr: "Please fill out this field."
  },
  profileNavbar: {
    framily: "FRAMILY",
    info: "INFO",
    children: "CHILDREN"
  },
  profileInfo: {
    adress: "Address",
    description: "Description",
    email: "Personal",
    mobile: "Mobile",
    home: "Home",
    unspecified: "Unspecified"
  },
  profileScreen: {
    privateProfile: "Profile is private"
  },
  editProfileScreen: {
    whatsappOption: "WhatsApp",
    viberOption: "Viber",
    emailOption: "Email",
    save: "SAVE",
    header: "Edit profile",
    name: "Name",
    surname: "Surname",
    phoneNumber: "Phone number",
    phoneLabel: "Label",
    street: "Street",
    streetNumber: "Number",
    country: "Country",
    city: "City",
    description: "Provide an optional description...",
    email: "Email address",
    mobile: "Mobile",
    home: "Home",
    unspecified: "Unspecified",
    visible: "Visible profile",
    invisible: "Invisible Profile",
    cityErr: "City doesn't exist",
    requiredErr: "Please fill out this field."
  },
  editGroupScreen: {
    phone: "Phone",
    email: "E-mail",
    none: " - ",
    save: "SAVE",
    header: "Edit group",
    name: "Name",
    description: "Description",
    file: "Upload",
    area: "Area",
    nameErr: "Group name already exists",
    visible: "Visible group",
    invisible: "Invisible group",
    requiredErr: "Please fill out this field."
  },
  profileHeader: {
    export: "Export",
    delete: "Delete",
    signout: "Sign out",
    deleteDialogTitle:
      "Are you sure you want to delete your profile and remove all your data?",
    exportDialogTitle:
      "Are you sure you want to export all your personal information?",
    suspend: "Suspend",
    suspendDialogTitle:
      "Are you sure you want to temporarily suspend  your account?",
    suspendSuccess:
      "Your account has been suspended temporarily. Next time you log in your account will be reactivated.",
    exportSuccess:
      "You will soon receive an e-mail with all your personal information",
    error: "Something went wrong."
  },
  replyBar: {
    new: "New message",
    maxFilesError: "You can upload a maximum of 3 files."
  },
  announcementReplies: {
    new: "Your comment..."
  },
  reply: {
    confirmDialogTitle: "Are you sure you want to delete your reply?"
  },
  groupHeader: {
    confirmDialogTitle: "Are you sure you want to delete the group?"
  },
  announcementHeader: {
    confirmDialogTitle: "Are you sure you want to delete this?"
  },
  childListItem: {
    boy: "Boy",
    girl: "Girl",
    age: "years old"
  },
  childProfileHeader: {
    delete: "Delete child",
    confirmDialogTitle:
      "Are you sure you want to delete the child and remove all its data?"
  },
  childProfileInfo: {
    boy: "Boy",
    girl: "Girl",
    unspecified: "Unspecified",
    age: " years old",
    additional: "Additional info",
    allergies: "Allergies",
    otherInfo: "Other info",
    specialNeeds: "Special needs",
    addAdditional: "ADD",
    addParent: "ADD PARENT",
    confirmDialogTitle: "Are you sure you want to delete this parent?"
  },
  editChildProfileScreen: {
    backNavTitle: "Edit profile",
    save: "SAVE",
    name: "Name",
    surname: "Surname",
    birthday: "Birthday",
    gender: "Gender",
    additional: "Add specific information",
    example: "e.g., food intolerances",
    boy: "Boy",
    girl: "Girl",
    date: "Date",
    add: "EDIT",
    month: "Month",
    year: "Year",
    file: "Choose File",
    unspecified: "Unspecified",
    requiredErrr: "Please fill out this field."
  },
  createChildScreen: {
    backNavTitle: "Add child",
    save: "SAVE",
    name: "Name",
    surname: "Surname",
    birthday: "Birthday",
    gender: "Gender",
    additional: "Add specific information",
    add: "ADD",
    edit: "EDIT",
    example: "e.g., food intolerances",
    boy: "Boy",
    girl: "Girl",
    date: "Date",
    month: "Month",
    year: "Year",
    acceptTerms:
      "I accept the Terms of Use and the Policy in regards to the treatment " +
      "and use of my data.",
    acceptTermsErr: "Please accept the terms",
    unspecified: "Unspecified",
    requiredErr: "Please fill out this field."
  },
  additionalInfoScreen: {
    backNavTitle: "Information",
    save: "SAVE",
    allergy: "Allergy",
    special: "Special needs",
    others: "Others",
    acceptTerms:
      "I acknowledge that this information will be disclosed with the group members " +
      "directly involved in the childcare activities."
  },
  createActivityScreen: {
    backNavTitle: "New activity"
  },
  createActivityStepper: {
    pendingMessage: "The activity is pending confirmation from an admin",
    continue: "Continue",
    cancel: "Cancel",
    finish: "Create",
    save: "Save",
    stepLabels: ["Information", "Dates", "Timeslots"]
  },
  createActivityInformation: {
    color: "Color of the activity",
    description: "Description (optional)",
    name: "Name of the activity",
    location: "Location (optional)"
  },
  createActivityDates: {
    header: "Select one or more days",
    repetition: "Repetition",
    weekly: "Weekly",
    monthly: "Monthly",
    datesError: "Repetition isn't available when multiple days are selected"
  },
  createActivityTimeslots: {
    header: "Add time slots to the selected days",
    differentTimeslots: "DIFFERENT TIMESLOTS FOR EACH DAY?",
    sameTimeslots: "SAME TIMESLOTS FOR EACH DAY?",
    selected: "dates selected"
  },
  timeslotsContainer: {
    addTimeslot: "ADD TIMESLOT",
    timeslot: "timeslot",
    timeslots: "timeslots",
    confirmDialogTitle: "Are you sure you want to delete this timeslot?",
    timeRangeError: "Invalid start and end time combination"
  },
  clockModal: {
    am: "AM",
    pm: "PM",
    start: "START",
    end: "END",
    confirm: "OK",
    cancel: "CANCEL"
  },
  activityScreen: {
    pdfToaster:
      "The activity is being exported in pdf format. You will shorty receive it via e-mail",
    excelToaster:
      "The activity is being exported in excel format. You will shorty receive it via e-mail",
    volunteers: "Volunteers",
    participant: "participant",
    participants: "participants",
    children: "Children",
    signup: "signed up",
    color: "Color",
    deleteDialogTitle: "Are you sure you want to delete this activity?",
    exportDialogTitle: "Are you sure you want to export this activity?",
    delete: "Delete",
    exportPdf: "Export PDF",
    exportExcel: "Export Excel",
    every: "Every",
    of: "of",
    infoHeader: "Activity Info:"
  },
  timeslotsList: {
    fixed: "fixed",
    completed: "completed",
    timeslot: "Timeslot",
    timeslots: "Timeslots",
    available: " available",
    all: "All timeslots",
    mySigned: "My signed up",
    myChildrenSigned: "My children signed up",
    enough: "With enough participants",
    notEnough: "Without enough participants"
  },
  filterTimeslotsDrawer: {
    header: "Filter timeslots",
    all: "All timeslots",
    mySigned: "My signed up",
    myChildrenSigned: "My children signed up",
    enough: "With enough participants",
    notEnough: "Without enough participants"
  },
  expandedTimeslot: {
    signup: "Sign up:",
    parents: " parents signed up",
    children: " children signed up",
    parent: " parent signed up",
    child: " child signed up",
    fixed: "Fixed",
    completed: "Completed"
  },
  expandedTimeslotEdit: {
    details: "Details",
    from: "From",
    to: "To",
    parents: "Required parents",
    children: "Required children",
    footer:
      "Changes will be made only on this timeslot and not on the activity",
    name: "Title",
    location: "Location",
    description: "Description(optional)",
    cost: "Cost(optional)",
    status: "Timeslot status",
    fixed: "Fixed",
    completed: "Completed",
    timeErr: "Invalid start and end time combination",
    requiredErr: "Please fill out this field.",
    rangeErr: "Please select a value greater than zero.",
    learning: "learning or educational activities/homework",
    nature: "nature",
    tourism: "tourism and culture",
    hobby: "hobby and sport",
    accompanying: "accompanying(car sharing or pedibus)",
    entertainment: "entertainment",
    parties: "parties or events",
    coplaying: "co-playing day(s)",
    other: "other",
    category: "Type of activity"
  },
  editActivityScreen: {
    backNavTitle: "Edit activity",
    color: "Color of the activity",
    description: "Description (optional)",
    name: "Name of the activity",
    save: "SAVE",
    location: "Location (optional)"
  },
  agendaView: {
    timeslots: "Timeslots",
    available: " available",
    all: "All timeslots",
    signed: "My signed up",
    enough: "With enough participants",
    notEnough: "Without enough participants",
    notEnoughParticipants: "Not enough participants"
  },
  confirmDialog: {
    agree: "Ok",
    disagree: "Cancel"
  },
  pendingRequestsScreen: {
    requests: "Pending Requests",
    invites: "Pending Invites",
    activities: "Pending Activities",
    confirm: "CONFIRM",
    delete: "DELETE"
  },
  forgotPasswordScreen: {
    prompt: "Please enter your email to receive a link to change your password",
    email: "Email",
    backNavTitle: "Forgot password",
    send: "SEND",
    notExistErr: "User doesn't exist",
    err: "Something went wrong",
    success: "Email sent",
    requiredErrr: "Please fill out this field."
  },
  changePasswordScreen: {
    prompt: "Please enter your new password",
    password: "Password",
    confirm: "Confirm password",
    change: "CHANGE",
    err: "Passwords don't match",
    badRequest: "Bad Request",
    requiredErr: "Please fill out this field",
    tooShortErr: "Please use at least 8 characters."
  },
  calendar: {
    userCalendar: "My Calendar",
    groupCalendar: "Group Calendar"
  },
  framilyListItem: {
    delete: "Delete framily"
  }
};

const nl = {
  participantsModal: {
    header: "Deelnemers",
    cancel: "Sluiten"
  },
  managePlanSolution: {
    needsHeader: "SLOT BEHOEFTEN",
    selectFrom: "Selecteer beschikbaarheid van",
    participating: "Plan deelnemende leden",
    available: "Slot beschikbare leden",
    all: "Alle groepsleden",
    automaticSuccess: "Plan is met succes omgezet in activiteiten",
    manualSuccess:
      "U ontvangt binnenkort de definitieve oplossing van het plan via e-mail"
  },
  groupManagementScreen: {
    backNavTitle: "Csoportkezelés",
    totalVolunteers: "Önkéntesek összes száma",
    totalKids: "A gyerekek teljes száma",
    totalEvents: "Események összes száma",
    totalCompletedEvents: "A befejezett események összes száma",
    metricsHeader: "Csoportos mutatók",
    metricsColumn: "Metrika",
    rightsColumn: "Érték",
    chartHeader: "Felhasználónkénti összes hozzájárulás"
  },
  timeslotEmergencyScreen: {
    copy: "Noodnummer naar klembord gekopieerd",
    call: "Telefoontje",
    header: "Alarmnummers:",
    services: {
      general: "Algemene noodsituatie",
      ambulance: "Ambulance",
      police: "Politie",
      fire: "Brandweer"
    }
  },
  editPlanScreen: {
    requiredErr: "Vul alstublieft dit veld in.",
    learning: "leer- of educatieve activiteiten / huiswerk",
    nature: "natuur",
    tourism: "toerisme en cultuur",
    hobby: "hobby en sport",
    accompanying: "begeleidend (autodelen of pedibus)",
    entertainment: "vermaak",
    parties: "feesten of evenementen",
    coplaying: "co-speeldag",
    other: "anders",
    category: "Soort activiteit",
    backNavTitle: "Plan bewerken",
    ratio: "ratio kinderen tot ouders",
    minVolunteers: "Minimum vrijwilligers",
    deadline: "Deadline",
    needsState: "Behoeften aangeven",
    availabilitiesState: "Beschikbaarheid aangeven",
    planningState: "Plan maken",
    creationState: "Activiteiten maken",
    state: "Planingsfase",
    needsStateHelper:
      "In de behoeftenfase selecteren de gebruikers de datums waarop zij kinderopvang nodig hebben. In deze status is de beschikbaarheidsfase vergrendeld.",
    availabilitiesStateHelper:
      "In de beschikbaarheidsfase selecteren de gebruikers de datums dat ze beschikbaar zijn voor kinderopvang. In deze fase is de behoeftenfase vergrendeld.",
    planningStateHelper:
      "In de planningsfase creëert het Families Share-algoritme een optimaal plan op basis van de gegeven behoeften en beschikbaarheid.",
    creationStateHelper:
      "In de aanmaakfase wordt het optimale plan omgezet in activiteiten."
  },
  createPlanStepper: {
    name: "Naam",
    from: "Van",
    to: "Aan",
    description: "Description",
    location: "Locatie",
    requiredErr: "Vul dit veld in.",
    deadlineErr: "De deadline moet vóór de opgegeven periode liggen",
    rangeErr: "Ongeldige begin- en einddatumcombinatie",
    continue: "Doorgaan",
    cancel: "Annuleren",
    finish: "Maken",
    save: "Opslaan",
    stepLabels: [
      "Geef een titel op voor de geplande activiteit",
      "Stel datumbereik in",
      "Zorg voor een deadline",
      "Geef de locatie op"
    ]
  },
  managePlanScreen: {
    export: "Exportplan",
    edit: "Plan bewerken",
    delete: "Plan verwijderen",
    exportConfirm: "Weet u zeker dat u dit plan wilt exporteren?",
    exportToaster:
      "Het plan wordt geëxporteerd in xls-formaat. U ontvangt het binnenkort via e-mail",
    backNavTitle: "Planning beheren",
    deleteConfirm: "Weet u zeker dat u dit plan wilt verwijderen?"
  },
  managePlanStepper: {
    pmTimeslotFrom: "PM tijdslot van",
    pmTimeslotTo: "Naar",
    amTimeslotFrom: "AM tijdslot van",
    amTimeslotTo: "Naar",
    create: "Create",
    discard: "Wegdoen",
    activitiesCreation: "Activiteiten maken",
    automatically: "automatisch",
    manually: "Handmatig",
    zeroVolunteersTimeslots: "Omgaan met tijdsloten zonder vrijwilligers",
    automaticSuccess: "Plan is met succes omgezet in activiteiten",
    manualSuccess:
      "U ontvangt binnenkort de definitieve oplossing van het plan via e-mail",
    linkSuccess: "U ontvangt binnenkort een e-mail met de bijbehorende link.",
    nextPhase: "Volgende fase",
    previousPhase: "Vorige fase",
    finishPlan: "Activiteiten maken",
    continue: "Doorgaan",
    cancel: "Annuleren",
    finish: "Verzenden",
    link: "Ontvang link",
    desktopPrompt:
      "Om de geboden oplossing te bewerken, moet u het platform openen via een desktop of laptop. Druk op de knop om een ​​e-mail met het platformadres te ontvangen.",
    stepLabels: [
      "Benodigdheden toevoegen",
      "Aanpassen behoeften",
      "Beschikbaarheid toevoegen",
      "Beschikbaarheden aanpassen",
      "Beheer oplossing",
      "Beheer activiteitsgegevens"
    ],
    needsDeadline: "Geef je opvangnoden aan voor",
    availabilitiesDeadline: "U moet uw beschikbaarheden opgeven tot",
    availabilityError: "Beschikbaarheid ontbreekt voor datum",
    needError: "Ontbrekende kindopdracht voor datum",
    needsSuccess: "U hebt met succes uw behoeften toegevoegd",
    availabilitiesSuccess: "U hebt met succes uw beschikbaarheden toegevoegd"
  },
  planListItem: {
    participantsNeeds: "leden hebben hun behoeften aangegeven",
    participantNeeds: "lid heeft behoeften aangegeven",
    participantsAvailabilities: "leden hebben hun beschikbaarheid aangegeven",
    participantAvailabilities: "lid heeft gespecificeerde beschikbaarheden",
    needsPhase: "Behoeften aangeven",
    availabilitiesPhase: "Beschikbaarheden aangeven",
    planningPhase: "Optimale oplossing vinden",
    creationPhase: "Plan omzetten in activiteiten"
  },
  communityInterface: {
    backNavTitle: "Gemeenschaps interface",
    totalNumberOfUsers: "Totaal aantal gebruikers",
    totalNumberOfGroups: "Totaal aantal groepen",
    averageAppRating: "App-beoordeling",
    averageNumberOfActivitiesPerGroup:
      "Gemiddeld aantal activiteiten per groep",
    averageNumberOfMembersPerGroup: "Gemiddeld aantal leden per groep",
    totalNumberOfChildren: "Totaal aantal kinderen",
    analyticsHeader: "Analytics",
    communityGrowth: "Gebruikersgroei platform (%)",
    totalNumberOfGoogleSignups: "Geregistreerd via Google",
    totalNumberOfPlatformSignups: "Geregistreerd via Families_Share platform",
    timeslot_autoconfirm: "Timeslots automatisch bevestigen",
    auto_admin: "Groepslid automatische beheerder",
    metricsColumn: "Metriek",
    valuesColumn: "Waarde",
    configurationsHeader: "Configuraties",
    chartsHeader: "Grafieken",
    charts: [
      "Totaal aantal gebruikers",
      "Aantal gebruikers geregistreerd bij platform",
      "Aantal gebruikers geregistreerd bij Google",
      "Totaal aantal kinderen",
      "Totaal aantal groepen",
      "Gemiddeld aantal groepsleden",
      "Gemiddeld aantal groepsactiviteiten"
    ]
  },
  profileChildren: {
    addChildPrompt:
      "Je hebt nog geen kinderen toegevoegd. Klik op het kindpictogram om een ​​nieuw kind toe te voegen"
  },
  myCalendarScreen: {
    backNavTitle: "Mijn Kalender"
  },
  editTimeslotScreen: {
    details: "Gegevens",
    learning: "leer- of educatieve activiteiten / huiswerk",
    nature: "natuur",
    tourism: "toerisme en cultuur",
    hobby: "hobby en sport",
    accompanying: "begeleidend (autodelen of pedibus)",
    entertainment: "entertainment",
    parties: "partijen of evenementen",
    coplaying: "Bijspelen",
    other: "andere",
    category: "Type activiteit",
    addTimeslotTitle: "Nieuw Tijdslot",
    timeErr: "Ongeldige combinatie van begin- en eindtijd",
    from: "Van",
    to: "Tot",
    date: "Datum",
    parents: "Benodigde ouders",
    children: "Min. aantal kinderen",
    name: "Titel",
    location: "Locatie",
    description: "Beschrijving (optioneel)",
    cost: "Kost (optioneel)",
    status: "Tijdslot status",
    ongoing: "Bezig",
    completed: "Voltooid",
    requiredErr: "Vul alstublieft dit veld in.",
    rangeErr: "Selecteer een waarde groter dan nul.",
    editConfirm: "Bewerkingen bevestigen?",
    crucialChangeConfirm:
      "Als u deze bewerkingen opslaat, worden alle deelnemers afgemeld. Bevestig bewerkingen?",
    deleteConfirm: "Weet je zeker dat je dit tijdslot wilt verwijderen?"
  },
  timeslotScreen: {
    externals: "Externen",
    externalPlaceholder: "Externe vrijwilliger toevoegen",
    externalAvailabilities: "Voeg externe beschikbaarheden toe",
    allUsersAvailabilities: "Beschikbaarheid van gebruikers toevoegen",
    allChildrenAvailabilities: "Beschikbaarheid voor kinderen toevoegen",
    parentSubscribe1: "Je hebt toegevoegd",
    parentSubscribe2: "naar de activiteit",
    parentUnsubscribe1: "Je hebt verwijderd",
    parentUnsubscribe2: "van de activiteit",
    phoneConfirm: "Telefoontje",
    copy: "Nummer naar klembord gekopieerd",
    emergency: "NOODGEVAL",
    minimum: "minimum antaal",
    userAvailability: "Voeg uw beschikbaarheid toe:",
    childrenAvailability: "Voeg uw kinderen toe:",
    volunteer: "Vrijwilliger",
    volunteers: "Vrijwilligers",
    signup: "aangemeld",
    child: "kind",
    children: "kinderen",
    userSubscribe: "Je hebt jezelf aan de activiteit toegevoegd",
    userUnsubscribe: "Je hebt jezelf van de activiteit verwijderd",
    childSubscribe1: "Je hebt",
    childSubscribe2: "aan de activiteit toegevoegd",
    childUnsubscribe1: "Je hebt verwijderd",
    childUnsubscribe2: "van de activiteit",
    childSubscribeConfirm1: "Weet je zeker dat je wilt toevoegen",
    childSubscribeConfirm2: "naar de activiteit?",
    childUnsubscribeConfirm1: "Weet je zeker dat je wilt verwijderen",
    childUnsubscribeConfirm2: "van de activiteit?",
    editConfirm: "Bewerkingen bevestigen?",
    you: "Je",
    userSubscribeConfirm:
      "Weet je zeker dat je jezelf wilt toevoegen aan de activiteit?",
    userUnsubscribeConfirm:
      "Weet u zeker dat u uzelf uit de activiteit wilt verwijderen?",
    admins: "Groep admins"
  },
  timeslotPreview: {
    confirmed: "Bevestigd",
    pending: "Wachten op bevestiging",
    participating: "Jij en je kinderen zullen deelnemen",
    parentParticipating: "Je zult deelnemen",
    notParticipating: "Beschikbaar voor nieuwe inscripties"
  },
  ratingModal: {
    title: "Hoe zou je willen beoordelen Families Share?",
    rate: "Tarief",
    rateInstruction:
      "Tik op het aantal sterren dat u ons wilt geven op een schaal van 1-5."
  },
  landingHeader: {
    communityName: "De Stuyverij"
  },
  landingNavbar: {
    logIn: "Log in",
    signUp: "Registreer"
  },
  aboutScreen: {
    findOutMore: "LEES MEER OP DE WEBSITE",
    aboutHeader: "Over het project",
    privacyPolicy: "Privacybeleid",
    familyShareSolution: "De Families Share oplossing",
    firstParagraph:
      "Gesubsideerd binnen het informatie en communicatie technologie programma van het Horizon 2020 project en zijn oproep naar collectieve bewustzijnsplatformen voor duurzaamheid en sociale innovatie, creëert het Families Share project een sociaal netwerk en bewustzijns platform dat zich toelegt op het aanmoedigen van gedeelde kinderopvang en work/life balance. Het platform maakt gebruik van buurtnetwerken en stelt burgers in staat om samen te komen voor het delen van taken, tijd en skills die relevant zijn voor kinderopvang en naschoolse opvang / educatie.",
    challengeHeader: "De uitdaging",
    secondParagraph:
      "Het balanceren van werk en gezinsleven wordt  steeds moeilijker. De economische crisis had een tweedelige impact, zowel op de condities binnen de arbeidsmarkt als op welzijnsvoorzieningen. Dit resulteerde in stijgende werkloosheid. Stabiele jobs zijn niet langer een vast gegeven, tijdelijke / onstabiele contracten komen steeds meer aan bod. De dalende groep werknemers wordt blootgesteld aan een stijgende werkdruk en langere uren, iets wat de balans tussen werk en gezinsleven nog verder bemoeilijkt. Het huidige model is niet vol te houden.",
    fourthParagraph:
      "Het Families Share project biedt een bottom-up oplossing aan in de vorm van een co-ontworpen platform dat families ondersteund in het delen van tijd inzake kinderopvang, opvoeden, naschoolse activieiten en andere huishoudelijke taken. Om deze doelstelling te bereiken, doet  het project beroep op de bestaande kennis inzake digitale sociale innovaties  van de leden van het consortium. Ookwordt er gebruik gemaakt van het potentieel van ICT netwerken om  participatieve inovatie binnen zichzelf organiserende buurten te verhogen.",
    europeanUnionText:
      "Dit project kreeg subsidies van het Horizon 2020 project van de Europese unie. CAPS Topic: ICT-11-2017 Type ofaction: IA, Grant agreement No 780783 ",
    backNavTitle: "Over"
  },
  landingScreen: {
    suggestionsHeader: "Groepen binnen de community",
    cardHeader: "Over het project",
    cardInfo:
      " Het Families Share project creëert een sociaal netwerk en bewustzijns platform dat zich toelegt op het aanmoedigen van gedeelde kinderopvang en work/life balance."
  },
  logInScreen: {
    backNavTitle: "Log in",
    forgotPassword: "Paswoord vergeten?",
    orLogInWith: "Of log in met",
    google: "Google",
    facebook: "Facebook",
    dontHaveAccount: "Je hebt nog geen account?",
    signUp: "Registreer",
    agreeWithTerms:
      "Door u aan te melden, gaat u akkoord met onze Servicevoorwaarden en ons Privacybeleid"
  },
  logInForm: {
    password: "Wachtwoord",
    email: "Email",
    confirm: "Bevestig",
    authenticationErr: "Ongeldige login of paswoord",
    requiredErr: "Vul alstublieft dit veld in.",
    tooShortErr: "Gebruik ten minste 8 tekens.",
    typeMismatchErr: "Vul een geldig e-mailadres in."
  },
  signUpScreen: {
    backNavTitle: "Registreer",
    accountQuestion: "Heb je al een account?",
    logIn: "Log in"
  },
  signUpForm: {
    email: "Email",
    givenName: "Voornaam",
    familyName: "Achternaam",
    password: "Wachtwoord",
    confirmPassword: "Bevestig wachtwoord",
    confirm: "Bevestig",
    profileVisibility: "Mijn profiel is zichtbaar in zoekresultaten",
    termsPolicy: "Voorwaarden en beleid",
    phoneNumber: "Telefoon (optioneel)",
    confirmPasswordErr: "Wachtwoorden komen niet overeen",
    signupErr: "Een ander account gebruikt",
    passwordPrompt: "Wachtwoord moet uit minimaal 8 tekens bestaan",
    acceptTermsErr:
      "Gelieve de gebruiksvoorwaarden en het privacybeleid goed te keuren",
    requiredErr: "Vul alstublieft dit veld in.",
    tooShortErr: "Gebruik ten minste 8 tekens.",
    typeMismatchErr: "Vul een geldig e-mailadres in.",
    visibilityPrompt: "Gebruikers kunnen in de app naar mijn profiel zoeken"
  },
  privacyPolicyModal: {
    privacyPolicy: (
      <div>
        <h1>Families_Share privacybeleid</h1>
        <p>
          Dit privacybeleid is bedoeld om je te helpen begrijpen welke
          informatie we verzamelen, waarom we die verzamelen en hoe je uw
          gegevens kan updaten, managen, exporteren en verwijderen.
        </p>
        <ol type="i">
          <li>
            <h2>Families_Share privacybeleid </h2>
            <p>
              Welkom bij the website van Families_Share. Deze site werd
              ontwikkeld om informatie te bieden over de Families_Share
              diensten. De Families_Share applicatie, samen met de website, zijn
              de “diensten” voor bezoekers en gebruikers (“u” en/of “uw”).
            </p>
            <p>
              Dit privacybeleid zet het Families_Share beleid uit inzake uw
              informatie, inclusief informatie die u identificeert of u zou
              kunnen identificeren als persoon (gekend als “persoonlijk
              identificeerbare informatie” in de VS of 'persoonlijke gegevens'
              in de Europese Unie, wij noemen zullen het “persoonlijke gegevens”
              noemen) en andere informatie die verzameld wordt van bezoekers en
              gebruikers van de diensten. Gelieve dit beleid aandachtg te lezen
              zodat je begrijpt hoe we omgaan met uw gegevens. Door gebruik te
              maken van onze diensten, geef je aan dat je dit privacybeleid het
              gelezen, het hebt begrepen en akkoord gaat. Als je niet akkoord,
              gelieve dan ook geen gebruik te maken van onze diensten. Voor
              vragen kan je altijd terecht bij
              <bold> contact@families-share.eu </bold>
            </p>
          </li>
          <li>
            <h2> Wie zijn wij? </h2>
            <p>
              Wij zijn ViLabs, de Familes_Share EU projectverantwoordelijke
              inzake ontwikkeling en onderhoud van de website en de applicatie
              inclusief de corresponderende diensten. Wij zijn ook de
              verantwoordelijke partner voor het verwerken en nazien van de data
              van het project. ViLabs CY (“Versatile Innovations”), ECASTICA
              Business centre 6, Vasili Vryonides str. Gala Court Chambers,
              Limassol, Cyprus t. +30 2310 365 188, +35 725 760 967,
              <bold>info@vilabs.eu</bold>. We refereren naar dit team als
              ‘ViLabs”, ‘wij”, “ons” and “onze”.
            </p>
          </li>
          <li>
            <h2>
              Onze wettelijke status en toepasselijke wetgeving inzake
              gegevensprivacy
            </h2>
            <p>
              ViLabs vervult de rol van gegevensverwerker en gegevensbeheerder
              volgens de EU-wetgeving. Alle persoonlijke gegevens worden
              verzameld, gebruikt, opgeslagen en verwerkt in volledige
              overeenstemming met de algemene gegevensbescherming wetgeveing
              (Wetgeving (UE) 679/2016 ook bekend als "GDPR") en Richtlijn
              2002/58 / EG van het Europees Parlement (Richtlijn betreffende
              privacy en elektronische communicatie). Alleen de
              Vilabs-onderzoekers en -systeembeheerders hebben toegang tot de
              gegevensmap. De Families_Share diensten worden gehost op servers
              in de Europese Unie en worden aangeboden door contabo
              (https://contabo.com/).
            </p>
          </li>
          <li>
            <h2> Informatie die we verzamelen</h2>
            <p>
              Wanneer u via de diensten met ons communiceert, verzamelen wij
              persoonsgegevens en andere informatie van u, zoals hieronder
              verder beschreven: We verzamelen persoonsgegevens van u wanneer u
              vrijwillig dergelijke informatie verstrekt, zoals wanneer u
              contact met ons opneemt voor vragen, zich registreert voor toegang
              tot de diensten of bepaalde diensten gebruikt.
            </p>
            <p>
              In het bijzonder zal in het Families_Share platform informatie
              worden verzameld over ouders, kinderen en kinderopvanggroepen.
            </p>
            <ul>
              <li>
                <p>
                  &bull; Over ouders: naam, achternaam, telefoonnummer, adres,
                  e-mailadres en foto / avatar.
                </p>
              </li>
              <li>
                <p>
                  &bull; Over kinderen: de informatie wordt alleen verzameld
                  door degenen die ouderlijke verantwoordelijkheid dragen, en er
                  is het recht om de relevante informatie te verstrekken, in
                  overeenstemming met de relevante wetgeving. De informatie is:
                  naam, geboortedatum, geslacht, foto / avatar en andere
                  informatie die rechtstreeks door ouders wordt gespecificeerd
                  (allergieën, ziekten, specifiek dieet, speciale behoefte,
                  enz.).
                </p>
              </li>
              <li>
                <p>
                  &bull; Over kinderopvanggroepen: de groepsnaam, groepsbio,
                  kinderopvanglocatie, kinderopvangperioden en de berichten in
                  de groepsfeed (tekst & afbeelding).
                </p>
              </li>
              <li>
                <p>
                  &bull; Technische of andere details over elk apparaat dat u
                  gebruikt om toegang te krijgen tot de Services, inclusief
                  Device Unique Device Identifier (UDID) of equivalent; uw
                  besturingssysteem, browsertype of andere software; uw
                  hardware- of mobiele apparaatgegevens (inclusief het type en
                  nummer van uw mobiele apparaat en details van de mobiele
                  provider), indien van toepassing; of andere technische
                  details.
                </p>
              </li>
              <li>
                <p>
                  &bull; Details van uw gebruik van onze diensten: meetgegevens
                  over wanneer en hoe u de diensten gebruikt.
                </p>
              </li>
            </ul>
            <p>
              Door ons vrijwillig persoonlijke gegevens te verstrekken, stemt u
              ermee in dat wij deze gebruiken in het kader van de services en in
              overeenstemming met dit privacybeleid (art. 6, lid 1, lid a, AVG).
              Overigens moet de verwerking van persoonsgegevens ook rechtmatig
              zijn wanneer dit noodzakelijk is voor de uitvoering van de
              diensten (art. 6, lid 1, regel b, AVG). Met betrekking tot
              speciale categorieën van persoonlijke gegevens, geeft u expliciete
              toestemming voor de verwerking van die gegevens zodra u ze
              verstrekt voor de doeleinden van de diensten.
            </p>
          </li>
          <li>
            <h2>
              Ons gebruik van uw persoonlijke gegevens en andere informatie
            </h2>
            <p>
              Elke verzamelde informatie wordt onmiddellijk gescheiden in (i)
              een deel dat persoonlijke (niet gevoelige) informatie (zoals naam,
              e-mailadres, telefoonnummer, etc.) bevat over de betrokken
              deelnemers en (ii) een deel dat volledig geanonimiseerd is (niet-
              persoonlijk identificeerbaar) en vervolgens beschikbaar gesteld
              aan het hele consortium voor onderzoeksdoeleinden.
            </p>
            <p>
              Persoonlijke gegevens van deelnemers aan elk CityLab worden via de
              app gedeeld met de andere leden van de groep voor het
              activiteitenbeheer van Families_Share, onder controle van de
              groepsbeheerder. Elk misbruik door een lid zal resulteren in de
              annulering van zijn / zijn account. Merk op dat elk verzoek om
              deel uit te maken van een groep onderworpen is aan goedkeuring
              door de groepsbeheerder.
            </p>
            <p>
              Aanvullende persoonlijke gegevens van deelnemers worden indien
              nodig alleen verzameld voor wetenschappelijke doeleinden
              (bijvoorbeeld voor verdere contacten voor longitudinale studies)
              en worden onmiddellijk na de voltooiing van het project
              verwijderd. Geanonimiseerde gegevens worden opgeslagen in een
              gedeelde repository en zullen na de voltooiing van het project
              worden bewaard als bewijs voor de studies en publicaties.
            </p>
            <p>
              In het bijzonder kunnen de diensten dergelijke informatie
              gebruiken en deze op anonieme en algemene wijze combineren met
              andere informatie om bijvoorbeeld het totale aantal gebruikers van
              onze diensten, het aantal bezoekers van elke pagina van onze site
              en de domeinnamen bij te houden van de internetproviders van onze
              bezoekers (in dit geval zijn er geen persoonlijke gegevens bij
              betrokken).
            </p>
          </li>
          <li>
            <h2>
              {" "}
              Onze openbaarmaking van uw persoonlijke gegevens en andere
              informatie
            </h2>
            <p>
              Hoe dan ook, Families_Share (en dus de verantwoordelijke partner
              ViLabs) mag uw persoonlijke gegevens alleen bekend maken als dit
              wettelijk verplicht is of te goeder trouw gelooft dat een
              dergelijke actie noodzakelijk is om:
            </p>
            <ul>
              <li>
                <p> &bull; Te voldoen aan een wettelijke verplichting</p>
              </li>
              <li>
                <p>
                  &bull; e handelen in dringende omstandigheden om de
                  persoonlijke veiligheid van gebruikers van de diesnten of het
                  publiek te beschermen
                </p>
              </li>
              <li>
                <p> &bull; Te beschermen tegen wettelijke aansprakelijkheid </p>
              </li>
            </ul>
          </li>
          <li>
            <h2>Jouw keuzes</h2>
            <p>
              U kunt de diensten bezoeken zonder persoonlijke gegevens te
              verstrekken. Als u ervoor kiest om geen persoonlijke gegevens te
              verstrekken, kunt u bepaalde Families_Share diesnten mogelijk niet
              gebruiken.
            </p>
          </li>
          <li>
            <h2>Gegevensverzameling</h2>
            <p>
              Alle gegevens zijn afkomstig van gebruikers die zich hebben
              aangemeld bij het Families_Share platform. Meestal moeten ouders
              toestemming geven voor de behandeling van privé- en gevoelige
              informatie over hun kinderen. In het bijzonder wordt informatie
              van kinderen verstrekt door ouders en worden gegevens verzameld
              volgens de GDRP (artikel 8):
            </p>
            <ul>
              <li>
                <p>
                  &bull; Wanneer punt a) van artikel 6, lid 1, van toepassing is
                  op het aanbod van diensten van de informatiemaatschappij
                  rechtstreeks aan een kind, is de verwerking van de
                  persoonsgegevens van een kind geoorloofd wanneer het kind ten
                  minste 16 jaar oud is. Wanneer het kind jonger is dan 16 jaar,
                  is een dergelijke verwerking alleen geoorloofd als en voor
                  zover toestemming wordt gegeven of toegestaan ​​door de houder
                  van de ouderlijke verantwoordelijkheid voor het kind.
                </p>
              </li>
              <li>
                <p>
                  &bull;De verwerkingsverantwoordelijke levert redelijke
                  inspanningen om in dergelijke gevallen te verifiëren of de
                  toestemming van de houder van de ouderlijke
                  verantwoordelijkheid voor het kind is gegeven of
                  geautoriseerd, rekening houdend met de beschikbare
                  technologie.
                </p>
              </li>
              <li>
                <p>
                  &bull;Lid 1 doet geen afbreuk aan het algemene
                  verbintenissenrecht van de lidstaten, zoals de regels
                  betreffende de geldigheid, de vorming of de werking van een
                  overeenkomst met betrekking tot een kind. "
                </p>
              </li>
            </ul>
            <p>
              Onthoud ook punt 32 van de GDPR: “Toestemming moet worden gegeven
              door een duidelijke bevestigende handeling waarbij een vrij
              gegeven, specifieke, geïnformeerde en ondubbelzinnige indicatie
              wordt gegeven van de instemming van de betrokkene met de
              verwerking van persoonsgegevens die op hem of haar betrekking
              hebben, zoals door een schriftelijke verklaring , inclusief langs
              elektronische weg, of een mondelinge verklaring. Dit kan het
              aanvinken van een vakje bij het bezoeken van een internetwebsite,
              het kiezen van technische instellingen voor diensten van de
              informatiemaatschappij of een andere verklaring of gedrag dat in
              dit verband duidelijk aangeeft dat de betrokkene instemt met de
              voorgestelde verwerking van zijn of haar persoonlijke gegevens
              [...] de toestemming van de betrokkene moet worden gegeven na een
              verzoek langs elektronische weg, het verzoek moet duidelijk,
              beknopt en niet onnodig storend zijn voor het gebruik van de
              dienst waarvoor het wordt verstrekt ".
            </p>
          </li>
          <li>
            <h2>Kinderen</h2>
            <p>
              Families_Share verzamelt niet bewust persoonlijke gegevens die
              zijn verstrekt door kinderen jonger dan 16 jaar. Als u jonger bent
              dan 16 jaar, dient u geen persoonlijke gegevens in te dienen via
              de diensten. We moedigen ouders en wettelijke voogden aan om het
              internetgebruik van hun kinderen te controleren en ons te helpen
              bij het handhaven van ons privacybeleid door hun kinderen te
              instrueren om nooit persoonlijke gegevens aan de diensten te
              verstrekken zonder hun toestemming. Als u reden hebt om aan te
              nemen dat een kind jonger dan 16 jaar persoonlijke gegevens heeft
              verstrekt aan Families_Share via de diensten, neem dan contact met
              ons op en wij zullen proberen die informatie uit onze databases te
              verwijderen.
            </p>
          </li>
          <li>
            <h2>Strategie voor gegevensopslag en -bewaring</h2>
            <p>
              De algehele Families_Share diensten worden aangeboden via de
              cloud, en zowel de achterkant als de voorkant van het platform en
              de gegevens worden opgeslagen op beveiligde en beschermde
              dedicated servers via een gecertificeerde cloudprovider, die
              beschikt over alle benodigde infrastructuren en certificeringen
              vereist door de GDPR.
            </p>
            <p>
              De cloudserviceprovider wordt beheerd door een verantwoordelijke
              persoon van VILABS en een toegewijde functionaris voor
              gegevensbescherming - (Projectcoördinator Prof. Agostino Cortesi,
              Universita Ca’Foscari Venezia, cortesi@unive.it), volgens de best
              practices en beschikbare normen.
            </p>
            <p>
              Persoonlijke gegevens worden opgeslagen gedurende de officiële
              levenscyclus van het Families_Share EU Funded Horizon 2020-project
              (tot 31/10/2020). Na het einde van de officiële periode van het
              project worden de persoonlijke gegevens van gebruikers die hun
              account gedurende één jaar (365 dagen) niet hebben ingelogd,
              volledig verwijderd.
            </p>
            <p>
              De beveiligde opslagfaciliteit van de Cloud-serviceprovider is
              gebaseerd op redundante systemen en bevindt zich in de EU. Er
              wordt dagelijks een back-up van gegevens gemaakt en een back-up
              wordt opnieuw opgeslagen in datacenters in de EU
            </p>
            <p>
              Toegang tot gegevens over de opslag is afhankelijk van
              authenticatie met behulp van gebruikersnaam en wachtwoord beheerd
              in overeenstemming met Richtlijn 2002/58 / EG van het Europees
              Parlement.
            </p>
            <p>
              Alleen de ViLabs-onderzoekers (voor onderzoeksdoeleinden) en
              systeembeheerders (voor onderhoudsdoeleinden) hebben toegang tot
              de gegevensmap.
            </p>
          </li>
          <li>
            <h2>Overdracht van gegevens aan derden</h2>
            <p>
              Geen van de verzamelde persoonlijke informatie zal worden gedeeld
              met derden. De verzamelde informatie zal alleen binnen het
              platform zelf worden gebruikt, zoals hierboven beschreven (V.)
            </p>
            <p>
              De app maakt geen gebruik van impliciete "intenties". Dit voorkomt
              dat de gegevens op ongepaste wijze worden benaderd door andere
              apps die op hetzelfde apparaat zijn geïnstalleerd.
            </p>
          </li>
          <li>
            <h2>Veiligheid</h2>
            <p>
              ViLabs neemt redelijke stappen om de via de diensten verstrekte
              persoonlijke gegevens te beschermen tegen verlies, misbruik en
              ongeautoriseerde toegang, openbaarmaking, wijziging of
              vernietiging. De datacommunicatie van / naar de gebruiker wordt
              beheerd via het https SSL-protocol.
            </p>
            <p>
              Het is uw verantwoordelijkheid om de toegang tot het apparaat
              waarop de app is geïnstalleerd, goed te beschermen tegen
              ongeautoriseerd gebruik.
            </p>
            <p>
              Geregistreerde Families_Share gebruikers hebben een gebruikersnaam
              en een unieke identificatie, waarmee u toegang hebt tot bepaalde
              delen van onze diensten. U bent verantwoordelijk voor het
              vertrouwelijk houden ervan. Deel ze met niemand anders.
            </p>
          </li>
          <li>
            <h2>Uw rechten - Uw account sluiten</h2>
            <p>
              De EU-wetgeving inzake gegevensbescherming geeft EU-burgers recht
              op toegang tot informatie over hen. Deze informatie is hierboven
              vermeld en kan door u worden bewerkt via de services, volgens de
              AVG (art. 15-22). Daarnaast heb je het recht op rectificatie, het
              recht om de gegeven toestemming in te trekken (wanneer de
              toestemming de wettelijke basis is voor de verwerking van
              persoonsgegevens), het recht om te wissen ('recht om te worden
              vergeten'), het recht om de verwerking te beperken, het recht op
              gegevensoverdraagbaarheid, het recht om bezwaar te maken tegen
              verwerking, het recht om niet te worden onderworpen aan een
              beslissing op basis van geautomatiseerde verwerking (inclusief
              profilering), het recht om een ​​klacht in te dienen bij een
              toezichthoudende autoriteit, het recht op een effectief
              rechtsmiddel.
            </p>
            <p>
              U kunt ons e-mailen op <bold> contact@families-share.eu</bold>
            </p>
            <p>
              Alle gebruikers kunnen hun persoonlijke gegevens naar wens
              wijzigen, toegang hebben tot en een kopie van hun informatie en
              hun deelname aan activiteiten downloaden via de Families_Share
              applicatie, terwijl ze ook het recht hebben om hun account en alle
              informatie die relevant is voor hun account volledig te
              verwijderen.
            </p>
            <p>
              Na de annulering van het account door de gebruiker, behalve in het
              geval van anonieme gegevens, is er een verplichting om
              persoonlijke gegevens zo snel mogelijk te verwijderen, omdat de
              wettelijke basis voor verdere verwerking had moeten verdwijnen.
            </p>
            <p>
              U kunt ons ook e-mailen op contact@families-share.eu om te vragen
              dat wij uw persoonlijke gegevens uit onze database verwijderen.
            </p>
          </li>
          <li>
            <h2>Wijzigingen in het privacybeleid</h2>
            <p>
              Dit privacybeleid kan van tijd tot tijd worden gewijzigd. Wanneer
              wijzigingen worden aangebracht, wordt de hieronder vermelde
              ingangsdatum ook gewijzigd en wordt het nieuwe privacybeleid
              online gepubliceerd, terwijl alle betrokken partijen een speciale
              kennisgeving ontvangen.
            </p>
          </li>
          <li>
            <h2>Communicatie</h2>
            <p>
              Voor alle andere informatie over ons, bezoek onze website:
              https://www.families-share.eu/
            </p>
            <p>
              Neem ook gerust contact met ons op als u vragen heeft over het
              privacybeleid van Families_Share of de informatie praktijken van
              de diensten. U kunt als volgt contact met ons opnemen:
              contact@families-share.eu
            </p>
          </li>
          <li>
            <h2> Gegevensbeheer</h2>
            <p>
              DPO: Projectcoördinator Prof.Agostino Cortesi, Universita
              Ca’Foscari Venezia,<bold>cortesi@unive.it</bold>
            </p>
            <p>
              Platform Data Manager: Apostolos Vontas, ViLabs Director,{" "}
              <bold>avontas@vilabs.eu</bold>
            </p>
            <p>
              Gegevensbeheerde: Apostolos Vontas, ViLabs Director,
              <bold>avontas@vilabs.eu</bold>
            </p>
          </li>
        </ol>
        <p>
          Door op Accepteren te klikken, bevestig ik dat ik heb gelezen,
          begrepen en ga akkoord met het bovenstaande privacybeleid
        </p>
      </div>
    ),
    accept: "ACCEPTEER"
  },
  groupAbout: {
    header: "Over de groep",
    memberHeader: "Informatie"
  },
  groupActivities: {
    exportConfirm: "Weet u zeker dat u de groepsagenda wilt exporteren?",
    activitiesHeader: "Activiteiten van de groep",
    plansHeader: "In afwachting",
    export: "Exporteer agenda",
    newPlan: "Planning tool",
    newActivity: "Nieuwe activiteit"
  },
  activityListItem: {
    every: "Elk",
    of: "van"
  },
  groupListItem: {
    open: "Deelname aan de groep is gesloten",
    closed: "Deelname aan de groep is open",
    members: "Leden",
    kids: "Kinderen"
  },
  groupInfo: {
    contact: "CONTACTGROEP",
    contactMessage: "Info gekopieerd naar klembord",
    startGuideHeader: "Geen idee waar te beginnen?",
    startGuideInfo: "Neem een kijkje in de 7-stappen gids",
    join: "Sluit je aan bij de groep",
    leave: "Verlaat de groep",
    pending: "Annuleer verzoek",
    confirm: "Ben je zeker dat je de groep wilt verlaten"
  },
  groupNavbar: {
    chatTab: "Berichten",
    activitiesTab: "Activiteiten",
    membersTab: "Leden",
    infoTab: "Over",
    calendarTab: "Kalender"
  },
  groupMembersAdminOptions: {
    invite: "Nodig mensen uit",
    groupIsOpen: "De groep is open",
    groupIsClosed: "De groep is gelsoten",
    requestsOpen: "Verzoeken om lid te worden zijn welkom",
    requestsClosed: "Groep is volzet"
  },
  inviteModal: {
    memberHeader: "Mensen uitnodigen",
    parentHeader: "Voeg ouder toe",
    framilyHeader: "Voeg vriend toe",
    invite: "Uitnodigen",
    add: "Toevoegen",
    cancel: "Annuleer",
    search: "Zoek"
  },
  groupNewsNavbar: {
    children: "KINDEREN",
    parents: "OUDERS"
  },
  cardWithLink: { learnMore: "Kom meer te weten" },
  memberContact: {
    administrator: "Groep admin",
    addAdmin: "Admin toevoegen",
    removeAdmin: "Admin verwijderen",
    removeUser: "Verwijder gebruiker"
  },
  startUpGuide: {
    backNavTitle: "Opstart gids",
    guide: [
      { main: "Lanceer het initiatief binnen je kring", secondary: null },
      { main: "Verenig de eerste enthousiastelingen", secondary: null },
      { main: "Contacteer de locatie", secondary: null },
      { main: "Maak interne afspraken", secondary: null },
      { main: "Sluit de agenda", secondary: null },
      { main: "Kick-off!", secondary: null },
      { main: "Welkom", secondary: null }
    ]
  },
  notificationScreen: { backNavTitle: "Notificaties" },
  myFamiliesShareHeader: {
    confirmDialogTitle:
      "Wilt u dat een walkthrough van het platform naar uw e-mail wordt verzonden?",
    walkthrough: "Opstartgids",
    rating: "Beoordeel ons",
    header: "Mijn Families Share",
    homeButton: "Home",
    myProfile: "Mijn profiel",
    myCalendar: "Mijn kalender",
    createGroup: "Start een groep",
    searchGroup: "Zoek een groep",
    inviteFriends: "Nodig vrienden uit",
    faqs: "FAQ's",
    about: "Over",
    signOut: "Afmelden",
    language: "Taal",
    export: "Exporteer mijn data",
    community: "Gemeenschap"
  },
  myFamiliesShareScreen: {
    myGroups: "Mijn groepen",
    myActivities: "Mijn activiteiten",
    myNotifications: "Mijn notificaties",
    myGroupsPrompt:
      "Je bent nog niet in een groep, gebruik het laterale menu om er een te vinden",
    myActivitiesPrompt:
      "Hier ziet u uw toekomstige activiteiten nadat u zich heeft aangemeld voor een of meer groepen",
    joinPrompt: "DEELNEMEN AAN GROEP",
    createPrompt: "CREËER GROEP"
  },
  faqsScreen: {
    backNavTitle: "FAQ's"
  },
  searchGroupModal: {
    search: "Zoek een groep",
    results: "Resultaten",
    example: "bijv. Naschoolse activiteiten"
  },
  createGroup: { backNavTitle: "Start een groep" },
  createGroupStepper: {
    contactTypes: {
      phone: " - ",
      email: "E-mail",
      none: "Geen"
    },
    contactInfo: "Vul alstublieft uw contactgegevens in",
    continue: "Ga verder",
    cancel: "Annuleer",
    finish: "Voltooien",
    stepLabels: [
      "Voorzie een naam en beschrijving",
      "Zet je zichtbaarheid",
      "Geef het gebied op",
      "Geef contactgegevens op",
      "Nodig mensen uit"
    ],
    name: "Naam",
    description: "Beschrijving",
    visibleGroup: "Anderen kunnen mijn groep vinden",
    invisibleGroup: "Anderen kunnen mijn groep niet vinden",
    area: "Oppervlakte",
    invite: "Leden toevoegen",
    nameErr: "Deze groepsnaam bestaat al",
    requiredErr: "Vul alstublieft dit veld in."
  },
  profileNavbar: { framily: "Vrienden", info: "Info", children: "Kinderen" },
  profileInfo: {
    description: "Omschrijving",
    adress: "Adres",
    email: "Persoonlijk",
    mobile: "Mobiel",
    home: "Thuis",
    unspecified: "Ongedefinieerd"
  },
  profileScreen: {
    privateProfile: "Profiel is privé"
  },
  editProfileScreen: {
    whatsappOption: "WhatsApp",
    viberOption: "Viber",
    emailOption: "Email",
    description: "Geef een optionele beschrijving op...",
    save: "Opslaan",
    header: "Profiel bewerken",
    name: "Naam",
    surname: "Achternaam",
    phoneNumber: "Telefoon",
    phoneLabel: "Label",
    street: "Straat",
    streetNumber: "Nummer",
    country: "Land",
    city: "Stad",
    email: "Email adres",
    mobile: "Mobiel",
    home: "Thuis",
    unspecified: "Ongedefinieerd",
    visible: "Zichtbaar profiel",
    invisible: "Onzichtbaar profiel",
    cityErr: "Stad bestaat niet",
    requiredErr: "Vul alstublieft dit veld in."
  },
  editGroupScreen: {
    phone: "Telefoon",
    none: " - ",
    email: "E-mail",
    save: "Opslaan",
    header: "Groep bewerken",
    name: "Naam",
    description: "Beschrijving",
    file: "Upload",
    area: "Oppervlakte",
    nameErr: "Deze groepsnaam bestaat al",
    visible: "Zichtbare group",
    invisible: "Onzichtbare groep",
    requiredErr: "Vul alstublieft dit veld in."
  },
  profileHeader: {
    export: "Exporteer",
    delete: "Verwijder",
    signout: "Afmelden",
    exportDialogTitle:
      "Weet je zeker dat je al je persoonlijke informatie wilt exporteren?",
    deleteDialogTitle: "Ben je zeker dat je je account wilt verwijderen",
    suspend: "Opschorten",
    suspendDialogTitle:
      "Weet je zeker dat je je account tijdelijk wilt opschorten?",
    suspendSuccess:
      "Uw account is tijdelijk opgeschort. De volgende keer dat u inlogt, wordt uw account opnieuw geactiveerd.",
    exportSuccess:
      "U ontvangt binnenkort een e-mail met al uw persoonlijke gegevens",
    error: "Er is iets fout gegaan."
  },
  replyBar: {
    new: "Nieuw bericht",
    maxFilesError: "U kunt maximaal 3 bestanden uploaden."
  },
  announcementReplies: { new: "Je bericht…" },
  reply: {
    confirmDialogTitle: "Weet je zeker dat je je bericht wilt verwijderen?"
  },
  groupHeader: {
    confirmDialogTitle: "Weet je zeker dat je de groep wilt verwijderen?"
  },
  announcementHeader: {
    confirmDialogTitle: "Weet je zeker dat je dit wilt verwijderen?"
  },
  childListItem: { boy: "Jongen", girl: "Meisje", age: "jaar oud" },
  childProfileHeader: {
    delete: "verwijder kind",
    confirmDialogTitle: "Ben je zeker dat je je kind wilt verwijderen"
  },
  childProfileInfo: {
    confirmDialogTitle: "Weet je zeker dat je deze ouder wilt verwijderen?",
    boy: "Jongen",
    girl: "Meisje",
    unspecified: "Ongedefinieerd",
    age: " jaar oud",
    additional: "Extra info",
    allergies: "Allergieën",
    otherInfo: "Andere info",
    specialNeeds: "Specialen noden",
    addAdditional: "Voeg toe",
    addParent: "Voeg ouder toe"
  },
  editChildProfileScreen: {
    backNavTitle: "Profiel bewerken",
    save: "Opslaan",
    name: "Voornaam",
    surname: "Achternaam",
    birthday: "Geboortedag",
    gender: "Geslacht",
    additional: "Voeg specifieke info toe",
    example: "bv. voedingsintoleranties",
    boy: "Jongen",
    girl: "Meisje",
    date: "Datum",
    add: "Pas aan",
    month: "Maand",
    year: "Jaar",
    file: "Kies een bestand",
    unspecified: "Ongedefinieerd",
    requiredErr: "Vul alstublieft dit veld in."
  },
  createChildScreen: {
    backNavTitle: "Voeg kind toe",
    save: "Opslaan",
    name: "Voornaam",
    surname: "Achternaam",
    birthday: "Geboortedag",
    gender: "Geslacht",
    additional: "Voeg specifieke info toe",
    add: "Voeg toe",
    edit: "Pas aan",
    example: "bv. voedingsintoleranties",
    boy: "Jongen",
    girl: "Meisje",
    date: "Datum",
    month: "Maand",
    year: "Jaar",
    acceptTerms:
      "Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid inzake de verwerking van mijn gegevens.",
    acceptTermsErr: "Gelieve akkoord te gaan met de voorwaarden",
    unspecified: "Ongedefinieerd",
    requiredErr: "Vul alstublieft dit veld in."
  },
  additionalInfoScreen: {
    backNavTitle: "Informatie",
    save: "Opslaan",
    allergy: "Allergie",
    special: "Specialen noden",
    others: "Andere",
    acceptTerms:
      "Ik erken dat deze info meegedeeld zal worden met groepsleden die direct betrokken zijn bij de kinderactiviteiten."
  },
  createActivityScreen: { backNavTitle: "Nieuwe activiteit" },
  createPlanScreen: { backNavTitle: "Nieuwe Plan" },
  createActivityStepper: {
    pendingMessage: "De activiteit wacht op bevestiging van een beheerder",
    continue: "Ga verder",
    cancel: "Annuleer",
    finish: "Maak aan",
    save: "Opslaan",
    stepLabels: ["Informatie", "Datums", "Timeslots"]
  },
  createActivityInformation: {
    color: "Kleur van de activiteit",
    description: "Beschrijving (optioneel)",
    name: "Naam van de activiteit",
    location: "Plaats (optioneel)"
  },
  createActivityDates: {
    header: "Selecteer 1 of meerdere dagen",
    repetition: "Herhaling",
    weekly: "Wekelijk",
    monthly: "Maandelijks",
    datesError:
      "Herhaling is niet mogelijk wanneer meerdere dagen geselecteerd zijn"
  },
  createActivityTimeslots: {
    header: "Voeg een timeslot toe aan de geselecteerde dagen",
    differentTimeslots: "Verschillende timeslots voor iedere dag?",
    sameTimeslots: "Zelfde timeslots voor iedere dag?",
    selected: "datums geselecteerd"
  },
  timeslotsContainer: {
    addTimeslot: "Voeg timeslot toe",
    timeslot: "timeslot",
    timeslots: "timeslots",
    confirmDialogTitle: "Ben je zeker dat je dit timeslot wilt verwijderen",
    timeRangeError: "Onmogelijke combinatie van start en eind tijd"
  },
  clockModal: {
    am: "AM",
    pm: "PM",
    start: "Start",
    end: "Einde",
    confirm: "OK",
    cancel: "Annuleer"
  },
  activityScreen: {
    volunteers: "Vrijwilligers",
    pdfToaster:
      "De activiteit wordt geëxporteerd in pdf-formaat. U ontvangt deze binnenkort via e-mail.",
    excelToaster:
      "De activiteit wordt geëxporteerd in Excel-indeling. U ontvangt deze binnenkort via e-mail.",
    color: "Kleur",
    confirmDialogTitle: "Weet je zeker dat je deze activiteit wilt exporteren?",
    exportPdf: "Exporteren PDF",
    children: "Kinderen",
    exportExcel: "Exporteren Excel",
    delete: "Verwijder",
    every: "Elk",
    of: "van",
    deleteDialogTitle: "Ben je zeker dat je deze activiteit wilt verwijderen",
    infoHeader: "Activiteit informatie"
  },
  timeslotsList: {
    fixed: "vast",
    completed: "voltooid",
    timeslot: "Timeslot",
    timeslots: "Timeslots",
    available: " beschikbaar",
    all: "Alle timeslots",
    mySigned: "Mijn ingeschreven timeslots",
    myChildrenSigned: "Mijn kinderen ingeschreven timeslots",
    enough: "Met genoeg deelnemers",
    notEnough: "Met te weinig deelnemers",
    notEnoughParticipants: "Tekort aantal deelnemers"
  },
  filterTimeslotsDrawer: {
    header: "Filter timeslots",
    all: "Alle timeslots",
    mySigned: "Mijn ingeschreven timeslots",
    myChildrenSigned: "Mijn kinderen ingeschreven timeslots",
    enough: "Met genoeg deelnemers",
    notEnough: "Met te weining deelnemers"
  },
  expandedTimeslot: {
    signup: "Schrijf in:",
    parents: " ouders ingeschrven",
    children: " kinderen ingeschreven",
    parent: " ouder ingeschreven",
    child: " kind ingeschreven",
    fixed: "Vastgelegd",
    completed: "Voltooid"
  },
  expandedTimeslotEdit: {
    timeErr: "Ongeldige combinatie van begin- en eindtijd",
    details: "Details",
    from: "Van",
    to: "Tot",
    parents: "Benodigde ouders",
    children: "Benodigde kinderen",
    footer:
      "Aanpassingen worden enkel toegebracht binnen dit timeslot, niet voor de gehele activiteit",
    name: "Titel",
    location: "Locatie",
    description: "Beschrijving (optioneel)",
    cost: "Kost (optioneel)",
    status: "Timeslot status",
    fixed: "Vastgelegd",
    completed: "Voltooid",
    requiredErr: "Vul alstublieft dit veld in.",
    rangeErr: "Selecteer een waarde groter dan nul.",
    learning: "leer- of educatieve activiteiten / huiswerk",
    nature: "natuur",
    tourism: "toerisme en cultuur",
    hobby: "hobby en sport",
    accompanying: "begeleidend (autodelen of pedibus)",
    entertainment: "entertainment",
    parties: "partijen of evenementen",
    coplaying: "Bijspelen",
    other: "andere",
    category: "Type activiteit"
  },
  editActivityScreen: {
    backNavTitle: "Bewerk activiteit",
    color: "Kleur van de activiteit",
    description: "Beschrijving (optioneel)",
    name: "Naam van de activiteit",
    save: "Sla op",
    location: "Plaats (optioneel)"
  },
  agendaView: {
    timeslots: "Timeslots",
    available: " beschikbaar",
    all: "Alle timeslots",
    signed: "Mijn ingeschreven timeslots",
    enough: "Met genoeg deelnemers",
    notEnough: "Met te weining deelnemers",
    notEnoughParticipants: "Tekort aan deelnemers"
  },
  confirmDialog: { agree: "Ok", disagree: "Annuleren" },
  pendingRequestsScreen: {
    requests: "Lopende verzoeken",
    invites: "Lopende verzoeken",
    activities: "Activiteit aanvragen",
    confirm: "Bevestig",
    delete: "Verwijder"
  },
  forgotPasswordScreen: {
    prompt:
      "Vul email adres in om een link te ontvangen waarmee je je wachtwoord kan veranderen",
    email: "Email",
    backNavTitle: "Wachtwoord vergeten",
    send: "Verstuur",
    notExistErr: "Gebruiker bestaat niet",
    err: "Er ging iets mis",
    success: "Email verzonden",
    requiredErr: "Vul alstublieft dit veld in."
  },
  changePasswordScreen: {
    prompt: "Kies je nieuwe wachtwoord",
    password: "Wachtwoord",
    confirm: "Bevestig wachtwoord",
    change: "Verander",
    err: "Wachtwoorden komen niet overeen",
    badRequest: "Foutief verzoek",
    requiredErr: "Vul alstublieft dit veld in.",
    tooShortErr: "Gebruik ten minste 8 tekens."
  },
  calendar: { userCalendar: "Mijn kalender", groupCalendar: "Groep kalender" },
  framilyListItem: { delete: "" }
};

const it = {
  participantsModal: {
    header: "Partecipanti",
    cancel: "Chiudi"
  },
  managePlanSolution: {
    needsHeader: "ESIGENZE SLOT",
    selectFrom: "Seleziona disponibilità da",
    participating: "Pianifica membri partecipanti",
    available: "Membri disponibili slot",
    all: "Tutti i membri del gruppo",
    automaticSuccess: "Il piano è stato trasformato con successo in attività",
    manualSuccess: "Presto riceverai la soluzione finale del piano via e-mail"
  },
  groupManagementScreen: {
    backNavTitle: "Gestione gruppi",
    totalVolunteers: "Numero totale di volontari",
    totalKids: "Numero totale di bambini",
    totalEvents: "Numero totale di eventi",
    totalCompletedEvents: "Numero totale di eventi completati",
    metricsHeader: "Group Metrics",
    metricsColumn: "Metric",
    valoriColonna: "Valore",
    chartHeader: "Contributo totale per utente"
  },
  timeslotEmergencyScreen: {
    copy: "Numero di emergenza copiato negli appunti",
    call: "Chiama",
    header: "Numeri di emergenza:",
    services: {
      general: "Emergenza generale",
      ambulance: "Ambulanza",
      police: "Polizia",
      fire: "Vigili del fuoco"
    }
  },
  editPlanScreen: {
    requiredErr: "Compila questo campo.",
    learning: "attività di apprendimento / istruzione / compiti a casa",
    nature: "natura",
    tourism: "turismo e cultura",
    hobby: "hobby e sport",
    accompanying: "accompagnamento (car sharing o pedibus)",
    entertainment: "intrattenimento",
    parties: "feste o eventi",
    coplaying: "Giochi di gruppo",
    other: "altro",
    category: "Tipo di attività",
    backNavTitle: "Modifica piano",
    ratio: "Rapporto figli / genitori",
    minVolunteers: "Volontari minimi",
    deadline: "Scadenza",
    needsState: "Fornire bisogni",
    availabilitiesState: "Fornire disponibilità",
    planningState: "Crea piano",
    creationState: "Crea attività",
    state: "Plan State",
    needsStateHelper:
      "Nella fase di necessità gli utenti selezionano le date in cui avranno bisogno di assistenza all'infanzia. In questa fase la disponibilità è bloccata.",
    availabilitiesStateHelper:
      "Nella fase di disponibilità gli utenti selezionano le date in cui sono disponibili per l'assistenza all'infanzia. In questo stato è necessario bloccare la fase.",
    planningStateHelper:
      "Nella fase di pianificazione, l'algoritmo di condivisione delle famiglie crea un piano ottimale basato sulle esigenze e le disponibilità fornite.",
    creationStateHelper:
      "Nella fase di creazione il piano ottimale si trasforma in attività"
  },
  createPlanStepper: {
    name: "Nome",
    from: "Da",
    to: "A",
    description: "Descrizione",
    location: "Posizione",
    requiredErr: "Compila questo campo.",
    deadlineErr:
      "La scadenza deve essere precedente all'intervallo di date specificato",
    rangeErr: "Combinazione di date di inizio e fine non valide",
    continue: "Continua",
    cancel: "Annulla",
    finish: "Crea",
    save: "Salva",
    stepLabels: [
      "Fornisci un titolo per l'attività pianificata",
      "Imposta intervallo di date",
      "Fornire scadenza per le esigenze",
      "Fornisci la posizione"
    ]
  },
  managePlanScreen: {
    export: "Esporta piano",
    edit: "Modifica piano",
    delete: "Elimina piano",
    exportConfirm: "Sei sicuro di voler esportare questo piano?",
    exportToaster:
      "Il piano viene esportato in formato xls. Lo riceverai a breve via e-mail",
    backNavTitle: "Gestire la pianificazione",
    deleteConfirm: "Sei sicuro di voler eliminare questo piano??"
  },
  managePlanStepper: {
    create: "Crea",
    discard: "Scarta",
    zeroVolunteersTimeslots: "Gestisci timeslot senza volontari",
    activitiesCreation: "Crea attività",
    automatically: "Automaticamente",
    manually: "Manualmente",
    pmTimeslotFrom: "PM timeslot da",
    pmTimeslotTo: "A",
    amTimeslotFrom: "AM timeslot da",
    amTimeslotTo: "A",
    automaticSuccess: "Il piano è stato trasformato con successo in attività",
    manualSuccess: "Riceverai presto la soluzione finale del piano via e-mail",
    linkSuccess: "A breve riceverai un'e-mail con il link corrispondente.",
    nextPhase: "Next phase",
    previousPhase: "Fase precedente",
    finishPlan: "Crea attività",
    continue: "Continua",
    cancel: "Annulla",
    finish: "Invia",
    link: "Ricevere link",
    desktopPrompt:
      "Per modificare la soluzione fornita è necessario accedere alla piattaforma tramite un desktop o un laptop. Premere il pulsante per ricevere un'e-mail con l'indirizzo della piattaforma.",
    stepLabels: [
      "Aggiungi esigenze",
      "Personalizza le esigenze",
      "Aggiungi disponibilità",
      "Personalizza disponibilità",
      "Gestisci soluzione",
      "Gestisci i dettagli dell'attività"
    ],
    needsDeadline: "Devi fornire le tue esigenze fino al",
    availabilitiesDeadline: "Devi fornire le tue disponibilità fino al",
    availabilityError: "Disponibilità mancante per data",
    needError: "Assegnazione figlio mancante per data",
    needsSuccess: "Hai aggiunto con successo le tue esigenze",
    availabilitiesSuccess: "Hai aggiunto correttamente le tue disponibilità"
  },
  planListItem: {
    participantsNeeds: "i membri hanno esigenze specifiche",
    participantNeeds: "membro ha esigenze specifiche",
    participantsAvailabilities: "i membri hanno specificato le disponibilità",
    participantAvailabilities: "il membro ha specificato le disponibilità",
    needsPhase: "dichiarare i bisogni",
    availabilitiesPhase: "dichiarazione di disponibilità",
    planningPhase: "Trovare la soluzione ottimale",
    creationPhase: "Trasformazione del piano in attività"
  },
  communityInterface: {
    backNavTitle: "Interfaccia della comunità",
    totalNumberOfUsers: "Numero totale di utenti",
    totalNumberOfGroups: "Numero totale di gruppi",
    averageAppRating: "App rating",
    averageNumberOfActivitiesPerGroup: "Numero medio di attività per gruppo",
    averageNumberOfMembersPerGroup: "Numero medio di membri per gruppo",
    totalNumberOfChildren: "Numero totale di bambini",
    analyticsHeader: "Analytics",
    communityGrowth: "Crescita utenti della piattaforma (%)",
    totalNumberOfGoogleSignups: "Registrato utilizzando Google",
    totalNumberOfPlatformSignups:
      "Registrato utilizzando la piattaforma Families_Share",
    timeslot_autoconfirm: "Orario conferma automatico",
    auto_admin: "Membro del gruppo aamministratore automatico",
    metricsColumn: "Metrica",
    valuesColumn: "Valore",
    configurationsHeader: "Configurazioni",
    chartsHeader: "Grafici",
    charts: [
      "Numero totale di utenti",
      "Numero di utenti registrati con la piattaforma",
      "Numero di utenti registrati con google",
      "Numero totale di bambini",
      "Numero totale di gruppi",
      "Numero medio di membri del gruppo",
      "Numero medio di attività di gruppo"
    ]
  },
  profileChildren: {
    addChildPrompt:
      "Non hai ancora aggiunto figli. Fare clic sull'icona figlio per aggiungere un nuovo figlio"
  },
  myCalendarScreen: {
    backNavTitle: "Il mio calendario"
  },
  editTimeslotScreen: {
    learning: "attività di apprendimento / istruzione / compiti a casa",
    nature: "natura",
    tourism: "turismo e cultura",
    hobby: "hobby e sport",
    accompanying: "accompagnamento (car sharing o pedibus)",
    entertainment: "intrattenimento",
    parties: "feste o eventi",
    coplaying: "Giochi di gruppo",
    other: "altro",
    category: "Tipo di attività",
    addTimeslotTitle: "Nuovo orario",
    timeErr: "Combinazione di inizio e fine ora non valida",
    details: "Dettagli",
    from: "Da",
    to: "A",
    parents: "Genitori richiesti",
    children: "Bambini richiesti",
    name: "Titolo",
    location: "Luogo",
    description: "Descritzione (facoltativo)",
    cost: "Costo (facoltativo)",
    status: "Stato di questa attività",
    ongoing: "In corso",
    completed: "Completata",
    requiredErr: "Perfavore compila questo campo.",
    rangeErr: "Perfavore seleziona un valore maggiore di zero",
    date: "Data",
    editConfirm: "confermare le modifiche?",
    crucialChangeConfirm:
      "Se salvi queste modifiche, tutti i partecipanti verranno annullati. Conferma le modifiche?",
    deleteConfirm: "Sei sicuro di voler eliminare questo periodo di tempo?"
  },
  timeslotScreen: {
    externals: "Esterni",
    externalPlaceholder: "Aggiungi volontario esterno",
    externalAvailabilities: "Aggiungi disponibilità volontari esterni",
    allUsersAvailabilities: "Aggiungi disponibilità utenti",
    allChildrenAvailabilities: "Aggiungi disponibilità bambini",
    parentSubscribe1: "Hai aggiunto",
    parentSubscribe2: "all'attività",
    parentUnsubscribe1: "Hai rimosso",
    parentUnsubscribe2: "dall'attività",
    phoneConfirm: "Chiamata",
    copy: "Numero copiato negli appunti",
    emergency: "EMERGENZA",
    minimum: "numero minimo",
    userAvailability: "Aggiungi la tua disponibilità:",
    childrenAvailability: "Aggiungi la disponibilità dei tuoi bambini:",
    volunteer: "Volontario",
    volunteers: "Volontari",
    signup: "registrato",
    child: "Bambino",
    admins: "Amministratori",
    children: "Bambini",
    userSubscribe: "Ti sei aggiunto all'attività",
    userUnsubscribe: "Ti sei rimosso dall'attività",
    childSubscribe1: "Hai aggiunto",
    childSubscribe2: "all'attività",
    childUnsubscribe1: "Hai rimosso",
    childUnsubscribe2: "dall'attività",
    childSubscribeConfirm1: "Sei sicuro di voler aggiungere",
    childSubscribeConfirm2: "all'attività?",
    childUnsubscribeConfirm1: "Sei sicuro di voler rimuovere",
    childUnsubscribeConfirm2: "dall'attività?",
    editConfirm: "Conferma modifiche?",
    you: "Tu",
    userSubscribeConfirm: "Sei sicuro di voler aggiungerti all'attività?",
    userUnsubscribeConfirm:
      "Sei sicuro di voler rimuovere te stesso dall'attività?"
  },
  timeslotPreview: {
    confirmed: "Confermato",
    pending: "In attesa di conferma",
    participating: "Parteciperai tu e i tuoi figli",
    parentParticipating: "Parteciperai",
    notParticipating: "Disponibile per nuove iscrizioni"
  },
  ratingModal: {
    title: "Come vorresti valutare Families Share?",
    rate: "Vota",
    rateInstruction:
      "Tocca il numero di stelle che vorresti darci su una scala da 1 a 5."
  },
  landingHeader: {
    communityName: "Venezia"
  },
  landingNavbar: {
    logIn: "ACCEDI",
    signUp: "REGISTRATI"
  },
  aboutScreen: {
    findOutMore: "SCOPRI DI PIÙ SUL SITO",
    privacyPolicy: "Informativa privacy",
    aboutHeader: "Il progetto",
    familyShareSolution: "La soluzione proposta da Families_Share",
    firstParagraph:
      "Finanziato nell'ambito del programma \"Information and Communication Technologies\" di Horizon 2020, bando \"sviluppo di piattaforme di  partecipazione collettiva per la sostenibilità e l'innovazione sociale\", il progetto Families_Share sta sviluppando una piattaforma volta a favorire la diffusione di reti sociali e la sensibilizzazione nell'ambito della cura all'infanzia e dell'equilibrio vita-lavoro. La piattaforma sfrutta le reti di vicinato e consente ai cittadini di riunirsi per condividere compiti, tempo e competenze rilevanti per l'assistenza all'infanzia e l'educazione nel dopo scuola / tempo libero, laddove i servizi a ciò dedicati, nell'attuale periodo di stagnazione e austerità, sono diventati inaccessibili per le famiglie.",
    challengeHeader: "La sfida",
    secondParagraph:
      'In Europa, nell\'ultimo decennio, trovare un equilibrio tra lavoro e vita famigliare/privata è diventato sempre più una sfida per le famiglie. La crisi economica ha impattato non solo sul mercato del lavoro, ma anche sul welfare. Come conseguenza, i tassi di disoccupazione sono aumentati (soprattutto nei settori che impiegano maggiormente persone di sesso maschile), mentre molte lavoratrici ora sono impiegate part-time. Lavori "stabili" e a lungo termine non sono più la regola, mentre continuano ad aumentare i contratti "precari", con sempre più lavoratori/lavoratrici che seguono percorsi di riqualificazione e affrontano periodi di disoccupazione. Dall\'altro lato, una forza lavoro a tempo indeterminato sempre più ristretta è soggetta a maggiori carichi di lavoro e ad orari di lavoro più lunghi, rendendo più difficile il rapporto tra lavoro e vita quotidiana, nonché insostenibile il modello attuale.',
    fourthParagraph:
      "Il progetto Families_Share offre una soluzione dal basso, sotto forma di una piattaforma online (open source ed ad accesso aperto e gratuito) che supporti le famiglie nella condivisione del tempo e delle attività legate alla cura dei bambini, alla genitorialità, al doposcuola e tempo libero e alle attività domestiche, con una particolare attenzione all'inclusione delle famiglie a basso reddito. Il progetto aspira anche a coinvolgere gli anziani nelle attività di cura dei bambini, offrendo loro supporto nelle attività giornaliere e rendendoli partecipi agli eventi organizzati dalle famiglie. Per raggiungere tale obiettivo, il progetto parte dal concetto di \"banca del tempo\" capitalizzando le esperienze sull'innovazione digitale e cura all'infanzia dei partner. Il progetto sfrutta anche il potenziale delle reti delle tecnologie ICT, al fine di aumentare l'innovazione partecipata incoraggiando la diffusione di quartieri auto-organizzati. ",
    europeanUnionText:
      "Questo progetto ha ricevuto finanziamenti dal programma Europeo Horizon 2020, CAPS, Argomento: ICT-11-2017. Tipo di azione: IA. Grant Agreement n. 780783",
    backNavTitle: "Il progetto"
  },
  landingScreen: {
    suggestionsHeader: "Gruppi attivi",
    cardHeader: "Il progetto",
    cardInfo:
      "Il progetto Families_Share sta sviluppando una piattaforma volta a favorire la diffusione di reti sociali e la sensibilizzazione nell'ambito della cura all'infanzia e dell'equilibrio vita-lavoro"
  },
  logInScreen: {
    backNavTitle: "Accedi",
    forgotPassword: "Hai dimenticato la password?",
    orLogInWith: "O accedi con",
    google: "GOOGLE",
    facebook: "FACEBOOK",
    dontHaveAccount: "Non hai ancora un account?",
    signUp: "Registrati",
    agreeWithTerms:
      "Effettuando il login acconsente ai nostri termini di servizio e informativa sulla privacy"
  },
  logInForm: {
    password: "Password",
    email: "E-mail",
    confirm: "CONFERMA",
    authenticationErr: "E-mail o password errata",
    requiredErr: "Perfavore compila questo campo.",
    typeMismatchErr: "Si prega di inserire un indirizzo email valido.",
    tooShortErr: "Per favore usa almeno 8 caratteri."
  },
  signUpScreen: {
    backNavTitle: "Accedi",
    accountQuestion: "Hai già un account?",
    logIn: "Accedi"
  },
  signUpForm: {
    email: "E-mail",
    givenName: "Nome",
    familyName: "Cognome",
    password: "Password",
    confirmPassword: "Conferma password",
    confirm: "CONFERMA",
    profileVisibility: "Rendi il mio profilo visibile agli altri utenti ",
    termsPolicy: "Termini e condizioni",
    phoneNumber: "Numero di telefono (facoltativo)",
    confirmPasswordErr: "Le password non corrispondono ",
    signupErr: "Account già esistente ",
    passwordPrompt: "La password deve contenere almeno 8 caratteri",
    acceptTermsErr:
      "Per continuare, per favore accettare i termini e le condizioni",
    requiredErr: "Perfavore compila questo campo.",
    typeMismatchErr: "Si prega di inserire un indirizzo email valido.",
    tooShortErr: "Per favore usa almeno 8 caratteri.",
    visibilityPrompt:
      "Gli utenti potranno cercare il mio profilo all'interno dell'app"
  },
  privacyPolicyModal: {
    privacyPolicy: (
      <div>
        <h1>Informativa privacy di Families_Share</h1>
        <p>
          Questa Informativa sulla privacy ha lo scopo di aiutarti a capire
          quali informazioni raccogliamo, perché le raccogliamo e come puoi
          aggiornare, gestire, esportare ed eliminare le tue informazioni.
        </p>
        <ol type="i">
          <li>
            <h2>Informativa privacy di Families_Share</h2>
            <p>
              Benvenuti nel sito Web (il "Sito") di Families_Share. Questo sito
              è stato creato per fornire informazioni sui servizi
              Families_Share. L'applicazione Families_Share, insieme al sito
              Web, sono i "Servizi" per visitatori e utenti ("tu" e/o "tuo").
            </p>
            <p>
              La presente Informativa sulla privacy definisce la policy di
              Families_Share relativamente alle tue informazioni, comprese le
              informazioni che identificano o potrebbero identificarti
              personalmente (conosciute come "informazioni di identificazione
              personale" negli Stati Uniti o "dati personali" nell'Unione
              europea, che chiameremo "Dati Personali") e altre informazioni
              raccolta dai visitatori e dagli utenti dei Servizi. Si prega di
              leggere attentamente questinformativa sulla privacy in modo da
              comprendere come tratteremo i tuoi dati. Utilizzando uno qualsiasi
              dei nostri Servizi, confermi di aver letto, compreso e accettato
              la presente informativa sulla privacy. Se non accetti la presente
              policy, sei pregato di non utilizzare i nostri Servizi. In caso di
              domande, ti preghiamo di contattarci via email a
              <bold>contact@families-share.eu</bold>
            </p>
          </li>
          <li>
            <h2>Chi siamo</h2>
            <p>
              Siamo: ViLabs, il partner responsabile del progetto UE
              Families_Share per lo sviluppo e la manutenzione del sito Web e
              delle applicazioni Families_Share e dei relativi servizi, nonché
              Responsabile del trattamento e Titolare del trattamento del
              progetto. ViLabs CY ("Versatile Innovations"), ECASTICA Business
              centre 6, Vasili Vryonides str. Gala Court Chambers, Limassol,
              Cipro t. +30 2310 365 188, +35 725 760 967,
              <bold>info@vilabs.eu</bold>. Ci riferiamo a questo gruppo con i
              termini "ViLabs", "noi", e/o "nostro".
            </p>
          </li>
          <li>
            <h2>
              Il nostro stato legale e le leggi relative alla protezione dei
              dati personali
            </h2>
            <p>
              ViLabs ricopre il ruolo di responsabile del trattamento e di
              titolare del trattamento dei dati ai sensi della legislazione
              europea. Tutti i dati personali vengono raccolti, utilizzati,
              archiviati ed trattati nel pieno rispetto del Regolamento generale
              sulla protezione dei dati (Regolamento (UE) 679/2016 noto anche
              come "GDPR") e della Direttiva del Parlamento europeo 2002/58/CE
              (Direttiva sulla privacy e le comunicazioni elettroniche). Solo i
              ricercatori e gli amministratori di sistema di Vilabs avranno
              accesso alla cartella dei dati. I servizi Families_Share sono
              ospitati su server situati nell'Unione Europea e forniti da
              Contabo (https://contabo.com/).
            </p>
          </li>
          <li>
            <h2>Informazioni raccolte</h2>
            <p>
              Quando interagisci con noi attraverso i Servizi, raccogliamo dati
              personali e altre informazioni da te, tra cui quelle descritte di
              seguito: Raccogliamo dati personali da te quando fornisci
              volontariamente tali informazioni, ad esempio quando ci contatti
              per richieste, ti registri per accedere ai Servizi o utilizzi
              determinati Servizi.
            </p>
            <p>
              In particolare, la piattaforma Families_Share raccoglierà
              informazioni su genitori, bambini e gruppi di assistenza
              all'infanzia.
            </p>
            <ul>
              <li>
                <p>
                  &bull; Informazioni sui genitori: nome, cognome, numero di
                  telefono, indirizzo, e-mail e immagine/avatar.
                </p>
              </li>
              <li>
                <p>
                  &bull;Informazioni sui minori: le informazioni vengono
                  raccolte esclusivamente da coloro che esercitano la
                  responsabilità genitoriale e hanno il diritto di fornire le
                  informazioni pertinenti, conformemente alla legislazione in
                  materia. Le informazioni sono: nome, data di nascita, sesso,
                  immagine/avatar e altre informazioni specificate direttamente
                  dai genitori (allergie, malattie, dieta speciale, esigenze
                  particolari, ecc.).
                </p>
              </li>
              <li>
                <p>
                  &bull; Informazioni sui gruppi di assistenza all'infanzia: il
                  nome del gruppo, la descrizione del gruppo, la sede dei
                  servizi di assistenza all'infanzia, i periodi dei servizi di
                  assistenza all'infanzia e i messaggi nel feed del gruppo
                  (testo e immagine).
                </p>
              </li>
              <li>
                <p>
                  &bull; Specifiche tecniche o di altro genere su qualsiasi
                  dispositivo utilizzato per accedere ai Servizi, identificatore
                  univoco del dispositivo (UDID) o equivalente, il sistema
                  operativo, il tipo di browser o altro software, le specifiche
                  dell'hardware o del dispositivo mobile (tipo e numero del
                  dispositivo mobile e i dettagli del gestore di telefonia
                  mobile compresi) o altri eventuali dettagli tecnici compresi.
                </p>
              </li>
              <li>
                <p>
                  &bull; Dettagli sull'utilizzo dei nostri servizi: informazioni
                  sulle metriche su quando e come vengono utilizzati i servizi.
                </p>
              </li>
            </ul>
            <p>
              Fornendoci volontariamente i Dati personali, ci autorizzi a
              utilizzarli nel contesto dei Servizi e in conformità con la
              presente Informativa sulla privacy (art. 6, par. 1, lett. a,
              GDPR). A proposito, anche il trattamento dei dati personali
              dovrebbe essere lecito quando è necessario per lo svolgimento dei
              Servizi (art. 6, par. 1, lett. b) GDPR. Per quanto riguarda le
              categorie speciali di dati personali, dai il consenso esplicito al
              trattamento di tali dati nel momento in cui li fornisci ai fini
              dei Servizi.
            </p>
          </li>
          <li>
            <h2>
              L'uso che facciamo dei tuoi dati personali e altre informazioni
            </h2>
            <p>
              Ogni dato raccolto viene immediatamente attribuito a (i) una parte
              che contiene dati personali (non sensibili) (quali nome, e-mail,
              numero di telefono, ecc.) sui partecipanti coinvolti e (ii) una
              parte completamente anonimizzata (la persona non può essere
              identificata da questi dati) e quindi messo a disposizione
              dell'intero consorzio a fini della ricerca.
            </p>
            <p>
              I dati personali dei partecipanti a ciascun CityLab saranno
              condivisi tramite l'app agli altri membri del gruppo per la
              gestione delle attività Families_Share, sotto il controllo
              dell'amministratore del gruppo. Qualsiasi abuso da parte di un
              membro comporterà la cancellazione del suo account. Si noti che
              qualsiasi richiesta di far parte di un gruppo è soggetta
              all'approvazione dell'amministratore del gruppo. Ulteriori dati
              personali dei partecipanti saranno raccolti, se necessario,
              esclusivamente per scopi scientifici (ad esempio, per ulteriori
              contatti per studi longitudinali) e saranno cancellati
              immediatamente alla fine del progetto. I dati anonimizzati sono
              archiviati in un repository condiviso e saranno mantenuti dopo la
              fine del progetto come prova per gli studi e le pubblicazioni.
            </p>
            <p>
              In particolare, i Servizi possono utilizzare tali informazioni e
              condividerle con altre informazioni in forma anonima e
              generalizzata per tenere traccia, ad esempio, del numero totale di
              utenti dei nostri Servizi, del numero di visitatori di ciascuna
              pagina del nostro Sito e dei nomi di dominio dei gestori di
              servizi Internet dei nostri visitatori (in questo caso non sono
              dati personali).
            </p>
          </li>
          <li>
            <h2>
              La divulgazione dei tuoi dati personali e altre informazioni
            </h2>
            <p>
              Families_Share (e quindi il partner responsabile ViLabs) potrebbe
              comunque divulgare i tuoi dati personali solo se richiesto dalla
              legge o nella buona fede che tale azione sia necessaria ai fini
              di:
            </p>
            <ul>
              <li>
                <p> &bull; Osservare un obbligo di legge</p>
              </li>
              <li>
                <p>
                  &bull; prendere misure in circostanze urgenti per proteggere
                  la sicurezza personale degli utenti dei nostri servizi o del
                  pubblico
                </p>
              </li>
              <li>
                <p> &bull; Proteggere da responsabilità legale</p>
              </li>
            </ul>
          </li>
          <li>
            <h2>Le tue opzioni</h2>
            <p>
              È possibile visitare i Servizi senza fornire alcun dato personale.
              Se si sceglie di non fornire alcun dato personale, potrebbe non
              essere possibile accedere a determinati servizi Families_Share.
            </p>
          </li>
          <li>
            <h2>Raccolta dei dati</h2>
            <p>
              Tutti i dati provengono dagli utenti che si iscrivono alla
              piattaforma Families_Share. Nella maggior parte dei casi i
              genitori devono dare il loro consenso al trattamento dei dati
              privati e "sensibili" dei loro figli. In particolare, le
              informazioni sui minori vengono fornite dai genitori e i dati
              vengono raccolti secondo le normative del GDPR (articolo 8):
            </p>
            <ul>
              <li>
                <p>
                  &bull; Qualora si applichi l'articolo 6, paragrafo 1, lettera
                  a), per quanto riguarda l'offerta diretta di servizi della
                  società dell'informazione ai minori, il trattamento di dati
                  personali del minore è lecito ove il minore abbia almeno 16
                  anni di età. Ove il minore abbia un'età inferiore ai 16 anni,
                  tale trattamento è lecito soltanto se, e nella misura in cui,
                  tale consenso viene conferito o autorizzato dal titolare della
                  responsabilità genitoriale.
                </p>
              </li>
              <li>
                <p>
                  &bull;Il titolare del trattamento si adopera in ogni modo
                  ragionevole per verificare in tali casi che il consenso
                  conferito o autorizzato dal titolare della responsabilità
                  genitoriale sul minore, in considerazione delle tecnologie
                  disponibili.
                </p>
              </li>
              <li>
                <p>
                  &bull; Il punto 1 non pregiudica le disposizioni generali del
                  diritto dei contratti degli Stati membri, quali le norme sulla
                  validità, la formazione o l'efficacia di un contratto relativo
                  a un minore".
                </p>
              </li>
            </ul>
            <p>
              RRichiamiamo anche il punto 32 del GDPR: Il consenso deve essere
              conferito mediante un'azione positiva inequivocabile mediante la
              quale l'interessato manifesta l'intenzione libera, specifica,
              informata e inequivocabile di accettare il trattamento dei dati
              personali che lo riguardano, ad esempio mediante dichiarazione
              scritta, anche attraverso mezzi elettronici, o orale. Ciò potrebbe
              comprendere la selezione di un'apposita casella in un sito web, la
              scelta di impostazioni tecniche per servizi della società
              dell'informazione o qualsiasi altra dichiarazione o qualsiasi
              altro comportamento che indichi chiaramente in tale contesto che
              l'interessato accetta il trattamento proposto [...] Se il consenso
              dell'interessato viene richiesto attraverso mezzi elettronici, la
              richiesta deve essere chiara, concisa e non interferire
              immotivatamente con il servizio per il quale il consenso viene
              conferito.
            </p>
          </li>
          <li>
            <h2>Bambini</h2>
            <p>
              Families_Share non raccoglie consapevolmente dati personali
              forniti da bambini di età inferiore ai 16 anni. Se hai meno di 16
              anni, ti preghiamo di non inviare dati personali attraverso i
              Servizi. Invitiamo i genitori e i custodi legali a monitorare
              l'utilizzo di Internet dei propri figli e ad aiutare a far
              rispettare la nostra Informativa sulla privacy istruendo i propri
              figli a non conferire mai Dati personali sui Servizi senza il loro
              consenso. Se hai motivo di credere che un bambino di età inferiore
              ai 16 anni abbia fornito Dati personali a Families_Share
              attraverso i Servizi, ti preghiamo di contattarci e cercheremo di
              eliminare tali informazioni dai nostri database.
            </p>
          </li>
          <li>
            <h2>Strategia di archiviazione e conservazione dei dati </h2>
            <p>
              I servizi generali Families_Share vengono offerti attraverso il
              cloud e sia il back-end che il front-end della piattaforma e i
              dati sono archiviati su server dedicati sicuri e protetti
              attraverso un provider cloud certificato che possiede tutte le
              infrastrutture e le certificazioni necessarie secondo quanto
              disposto dal GDPR.
            </p>
            <p>
              Il gestore di servizi cloud è controllato da un responsabile di
              VILABS e da un responsabile della protezione dei dati dedicato -
              (Coordinatore del progetto Prof. Agostino Cortesi, Universita
              Ca'Foscari Venezia, <bold>cortesi@unive.it</bold>), attenendosi
              alle migliori pratiche e livelli esistenti.
            </p>
            <p>
              I dati personali verranno archiviati per tutto il ciclo di vita
              ufficiale del progetto Families-Share finanziato dall'UE
              nell'ambito di Horizon 2020 (fino al 10/31/2020). Dopo la fine del
              periodo ufficiale del progetto, i dati personali degli utenti che
              non hanno effettuato l'accesso al proprio account per un anno (365
              giorni) verranno completamente cancellati.
            </p>
            <p>
              La struttura di archiviazione protetta del gestore di servizi
              cloud conterà su sistemi ridondanti e avrà sede all'interno
              dell'Unione Europea. Il backup dei dati viene effettuato
              quotidianamente e una copia di backup viene nuovamente archiviata
              nei data center dell'UEs
            </p>
            <p>
              L'accesso ai dati sull'archiviazione è soggetto all'autenticazione
              mediante nome utente e password gestiti in conformità alla
              Direttiva 2002/58/CE del Parlamento europeo.
            </p>
            <p>
              Solo i ricercatori ViLabs (a scopo di ricerca) e gli
              amministratori di sistema (a fini di manutenzione) avranno accesso
              alla cartella dei dati.
            </p>
          </li>
          <li>
            <h2>Trasmissione di dati personali a terzi</h2>
            <p>
              Nessuna delle informazioni personali raccolte verrà condivisa con
              terzi. Le informazioni raccolte verranno utilizzate esclusivamente
              all'interno della piattaforma stessa, come descritto sopra (V.)
            </p>
            <p>
              L'app non fa uso di intenti impliciti. Ciò impedisce l'accesso ai
              dati senza motivo da parte di altre app installate sullo stesso
              dispositivo.
            </p>
          </li>
          <li>
            <h2>Sicurezza</h2>
            <p>
              ViLabs adotta misure ragionevoli per proteggere i Dati personali
              conferiti tramite i Servizi da perdita, uso improprio e accesso,
              divulgazione, alterazione o distruzione non autorizzati. La
              comunicazione dei dati da/per l'utente verrà gestita tramite il
              protocollo https basato su SSL.
            </p>
            <p>
              È responsabilità dell'utente proteggere correttamente l'accesso al
              dispositivo su cui è installata l'app da un utilizzo non
              autorizzato.
            </p>
            <p>
              Gli utenti registrati a Families_Share avranno un nome utente e un
              identificatore univoco, che consente di accedere a determinate
              sezioni dei nostri Servizi. Sei responsabile di mantenerli
              riservati. Non devono essere comunicati a nessuno.
            </p>
          </li>
          <li>
            <h2>I tuoi diritti - Chiusura del tuo account</h2>
            <p>
              La legislazione europea sulla protezione dei dati conferisce ai
              cittadini UE il diritto di accedere alle informazioni in loro
              possesso. Queste informazioni sono menzionate sopra e possono
              essere modificate dall'utente tramite i servizi, ai sensi del GDPR
              (art. 15-22). Inoltre, hai il diritto di rettifica, il diritto di
              revocare il consenso conferito (quando il consenso è la base
              legale per il trattamento dei dati personali), il diritto alla
              cancellazione ("diritto all'oblio"), il diritto a limitare il
              trattamento, il diritto alla portabilità dei dati, il diritto di
              opporsi al trattamento, il diritto a non essere soggetto a una
              decisione basata sul trattamento automatizzato (profilazione
              compresa), il diritto di proporre reclamo al Garante, il diritto
              al ricorso giurisdizionale effettivo.
            </p>
            <p>
              Puoi inviarci un'e-mail a <bold>contact@families-share.eu</bold>
            </p>
            <p>
              Tutti gli utenti possono modificare le loro informazioni personali
              come desiderano, avere accesso e scaricare una copia delle loro
              informazioni e la loro partecipazione alle attività tramite
              l'applicazione Families_Share, come anche il diritto di eliminare
              completamente il loro account e tutte le informazioni relative ai
              loro account.
            </p>
            <p>
              A seguito della cancellazione dell'account da parte dell'utente,
              tranne nel caso di dati anonimi, vi è l'obbligo di rimuovere i
              dati personali il più presto possibile poiché la base giuridica
              per ulteriore trattamento viene a cessare.
            </p>
            <p>
              Puoi anche inviarci un'e-mail a contact@families-share.eu
              chiedendoci di procedere alla cancellazione delle tue informazioni
              personali dal nostro database.
            </p>
          </li>
          <li>
            <h2>Modifiche alla Privacy Policy</h2>
            <p>
              Questa Informativa sulla privacy può subire modifiche di tanto in
              tanto. Quando vengono apportate modifiche anche la data di entrata
              in vigore riportata sotto cambierà di conseguenza e la nuova
              Informativa sulla privacy verrà pubblicata online, mentre tutte le
              parti interessate ne riceveranno apposita notifica.
            </p>
          </li>
          <li>
            <h2>Comunicazione</h2>
            <p>
              Per qualsiasi altra informazione sul nostro conto siete pregati di
              visitare il nostro sito Web: https://www.families-share.eu/
            </p>
            <p>
              Non esitare a contattarci in caso di domande sull'Informativa
              sulla privacy di Families_Share o sulle pratiche di informazione
              dei Servizi. Puoi contattarci a: contact@families-share.eu
            </p>
          </li>
          <li>
            <h2>Gestione dei dati</h2>
            <p>
              DPO: Coordinatore del progetto Prof. Agostino Cortesi, Universita
              Ca'Foscari Venezia, <bold>cortesi@unive.it</bold>
            </p>
            <p>
              Platform Data Manager: Apostolos Vontas, direttore di ViLabs,
              <bold>avontas@vilabs.eu</bold>
            </p>
            <p>
              Titolare del trattamento: Apostolos Vontas, direttore di ViLabs,
              avontas@vilabs.eu
              <bold>avontas@vilabs.eu</bold>
            </p>
          </li>
        </ol>
        <p>
          Facendo clic sul pulsante Accetta, confermo di aver letto, compreso e
          accetta l'informativa sulla privacy di cui sopra
        </p>
      </div>
    ),
    accept: "ACCETTA"
  },
  groupAbout: {
    memberHeader: "Informazioni",
    header: "Informazioni sul gruppo"
  },
  groupActivities: {
    exportConfirm: "Sei sicuro di voler esportare l'agenda del gruppo?",
    activitiesHeader: "Attività del gruppo",
    plansHeader: "Piani in sospeso",
    export: "Esporta l'agenda",
    newPlan: "Pianificazione avanzata",
    newActivity: "Nuova attività"
  },
  activityListItem: {
    every: "Ogni",
    of: "di"
  },
  groupListItem: {
    open: "Gruppo aperto: tutti possono richiedere di partecipare al gruppo",
    closed: "Gruppo chiuso: si può partecipare solo su invito",
    members: "Membri",
    kids: "Bambini"
  },
  groupInfo: {
    contact: "CONTATTA IL GRUPPO",
    contactMessage: "Informazioni copiate negli appunti",
    startGuideHeader: "Non sai da dove iniziare?",
    startGuideInfo: "Segui i sette passi per avviare al meglio il gruppo",
    join: "UNISCITI AL GRUPPO",
    leave: "ABBANDONA IL GRUPPO",
    pending: "CANCELLA LA RICHIESTA",
    confirm: "Sei sicuro/a di voler abbandonare il gruppo?"
  },
  groupNavbar: {
    chatTab: "Messaggi",
    activitiesTab: "Attività  ",
    membersTab: "Membri",
    infoTab: "Info",
    calendarTab: "Calendario"
  },
  groupMembersAdminOptions: {
    invite: "Invita altre persone",
    groupIsOpen: "Il gruppo è aperto",
    groupIsClosed: "Il gruppo è chiuso",
    requestsOpen: "Le iscrizioni al gruppo sono aperte",
    requestsClosed: "Il gruppo ha raggiunto il numero massimo di membri"
  },
  inviteModal: {
    memberHeader: "Invita altre persone",
    parentHeader: "Aggiungi un genitore",
    framilyHeader: "Aggiungi un amico",
    invite: "INVITA",
    add: "AGGIUNGI",
    cancel: "CANCELLA",
    search: "Cerca"
  },
  groupNewsNavbar: {
    parents: "GENITORI",
    children: "BAMBINI"
  },
  cardWithLink: { learnMore: "PER SAPERNE DI PIÙ" },
  memberContact: {
    administrator: "Amministratore del gruppo",
    addAdmin: "Aggiungi amministratore",
    removeAdmin: "Rimuovi amministratore",
    removeUser: "Rimuovi utente"
  },
  startUpGuide: {
    backNavTitle: "Come iniziare",
    guide: [
      { main: "Fai conoscere l'iniziativa ad altre persone", secondary: null },
      { main: "Raccogli i primi riscontri positivi", secondary: null },
      { main: "Trova un luogo ideale", secondary: null },
      { main: "Definisci delle cariche interne", secondary: null },
      { main: "Chiudi l'agenda", secondary: null },
      { main: "Si parte!", secondary: null },
      { main: "Benvenuti", secondary: null }
    ]
  },
  notificationScreen: { backNavTitle: "Notifica" },
  myFamiliesShareHeader: {
    confirmDialogTitle:
      "Vuoi una soluzione della piattaforma da inviare alla tua email?",
    walkthrough: "Guida all'avviamento",
    rating: "Votaci",
    header: "Il mio Families Share",
    homeButton: "Home page",
    myProfile: "Il mio profilo",
    myCalendar: "Il mio calendario",
    createGroup: "Crea un gruppo",
    searchGroup: "Cerca un gruppo",
    inviteFriends: "Invita amici",
    faqs: "FAQs",
    about: "Il progetto",
    signOut: "Esci ",
    language: "Lingua",
    export: "Esporta i miei dati",
    community: "Comunità"
  },
  myFamiliesShareScreen: {
    myGroups: "I miei gruppi",
    myActivities: "Le mie attività",
    myNotifications: "Le mie notifiche",
    myGroupsPrompt:
      "Non sei ancora in un gruppo, usa il menu laterale per trovarne uno",
    myActivitiesPrompt:
      "Qui vedrai le tue attività future dopo esserti registrato per uno o più gruppi",
    joinPrompt: "UNISCITI A UN GRUPPO",
    createPrompt: "CREA UN NUOVO GRUPPO"
  },
  faqsScreen: {
    backNavTitle: "FAQs"
  },
  searchGroupModal: {
    search: "Cerca un gruppo",
    results: "Risultati",
    example: "per esempio. Doposcuola"
  },
  createGroup: { backNavTitle: "Crea un gruppo" },
  createGroupStepper: {
    contactInfo: "Si prega di compilare le informazioni di contatto",
    contactTypes: {
      none: " - ",
      email: "E-mail",
      phone: "Telefono"
    },
    continue: "Continua",
    cancel: "Cancella",
    finish: "Termina",
    stepLabels: [
      "Fornisci nome e descrizione",
      "Imposta la visibilità del gruppo",
      "Fornire l'area",
      "Fornire informazioni di contatto",
      "Invita persone"
    ],
    name: "Nome",
    description: "Descrizione",
    visibleGroup: "Altri utenti possono trovare il gruppo",
    invisibleGroup: "Altri utenti NON possono trovare il gruppo",
    areay: "La zona",
    invite: "Aggiungi membri",
    nameErr: "Il nome scelto è già in uso da un altro gruppo",
    requiredErr: "Perfavore compila questo campo."
  },
  profileNavbar: {
    framily: "AMICI",
    info: "INFO",
    children: "BAMBINI"
  },
  profileInfo: {
    adress: "Indirizzo",
    description: "Descrizione",
    email: "Contatto personale ",
    mobile: "Cellulare",
    home: "Telefono",
    unspecified: "Non specificato"
  },
  profileScreen: {
    privateProfile: "Il profilo è privato"
  },
  editProfileScreen: {
    whatsappOption: "WhatsApp",
    viberOption: "Viber",
    emailOption: "Email",
    description: "Fornire una descrizione facoltativa",
    save: "SALVA",
    header: "Modifica il profilo",
    name: "Nome",
    surname: "Cognome",
    phoneNumber: "Numero di telefono",
    phoneLabel: "Etichetta",
    street: "Via/Piazza",
    streetNumber: "Numero civico",
    country: "Paese",
    city: "Città",
    email: "Indirizzo e-mail",
    mobile: "Cellulare",
    home: "Telefono",
    unspecified: "Non specificato",
    visible: "Profilo visibile",
    invisible: "Profilo non visibile",
    cityError: "Città non presente",
    requiredErr: "Perfavore compila questo campo."
  },
  editGroupScreen: {
    email: "E-mail",
    none: " - ",
    phone: "Telefono",
    save: "SALVA",
    header: "Modifica gruppo ",
    name: "Nome ",
    description: "Descrizione",
    file: "Carica",
    area: "La zona",
    nameErr: "Il nome scelto è già in uso da un altro gruppo",
    cityError: "La città non è presente",
    visible: "Gruppo visibile",
    invisible: "Gruppo non visibile",
    requiredErr: "Perfavore compila questo campo."
  },
  profileHeader: {
    export: "Esporta",
    delete: "Elimina",
    signout: "Esci",
    exportDialogTitle:
      "Sei sicuro di voler esportare tutte le tue informazioni personali?",
    deleteDialogTitle: "Confermi di voler eliminare il tuo account?",
    suspend: "Sospendere",
    suspendDialogTitle:
      "Sei sicuro di voler sospendere temporaneamente il tuo account?",
    suspendSuccess:
      "Il tuo account è stato sospeso temporaneamente. La prossima volta che accedi al tuo account verrà riattivato.",
    exportSuccess:
      "Presto riceverai un'e-mail con tutte le tue informazioni personali",
    error: "Qualcosa è andato storto."
  },
  replyBar: {
    new: "Nuovo messaggio",
    maxFilesError: "Puoi caricare un massimo di 3 file."
  },
  announcementReplies: {
    new: "Il tuo commento..."
  },
  reply: {
    confirmDialogTitle: "Confermi di voler eliminare la tua risposta?"
  },
  groupHeader: {
    confirmDialogTitle: "Confermi di voler eliminare il gruppo?"
  },
  announcementHeader: {
    confirmDialogTitle: "Confermi l'eliminazione?"
  },
  childListItem: {
    boy: "Bambino",
    girl: "Bambina",
    age: "anni"
  },
  childProfileHeader: {
    delete: "Cancella profilo bambino/a",
    confirmDialogTitle:
      "Confermi di voler eliminare il profilo di questo bambino/a?"
  },
  childProfileInfo: {
    confirmDialogTitle: "Sei sicuro di voler eliminare questo genitore?",
    boy: "Maschio",
    girl: "Femmina",
    unspecified: "Non specificato",
    age: "anni",
    additional: "Informazioni aggiuntive",
    allergies: "Allergie",
    otherInfo: "Altre informzioni",
    specialNeeds: "Bisogni speciali",
    addAdditional: "AGGIUNGI",
    addParent: "AGGIUNGI GENITORE"
  },
  editChildProfileScreen: {
    backNavTitle: "Modifica profilo",
    save: "SALVA",
    name: "Nome",
    surname: "Cognome",
    birthday: "Data di nascita",
    gender: "Genere",
    additional: "Aggiungi informazioni",
    example: "es., intolleranze alimentari",
    boy: "Bambino",
    girl: "Bambina",
    date: "Data",
    add: "MODIFICA",
    month: "Mese",
    year: "Anno",
    file: "Scegli file",
    unspecified: "Non specificato",
    requiredErr: "Perfavore compila questo campo."
  },
  createChildScreen: {
    backNavTitle: "Aggiungi un/a bambino/a",
    save: "SALVA",
    name: "Nome",
    surname: "Cognome",
    birthday: "Compleanno",
    gender: "Genere",
    additional: "Aggiungi informazioni",
    add: "AGGIUNGI",
    edit: "MODIFICA",
    example: "es., intolleranze alimentari",
    boy: "Bambino",
    girl: "Bambina",
    date: "Giorno",
    month: "Mese",
    year: "Anno",
    acceptTerms:
      "Accetto i Termini d'Uso e l'Informativa sulla Privacy per il trattamento e utilizzo dei miei dati.",
    acceptTermsErr:
      "Si prega di accettare i termini d'uso e l'informativa sulla provacy per procedere",
    unspecified: "Non specificato",
    requiredErr: "Perfavore compila questo campo."
  },
  additionalInfoScreen: {
    backNavTitle: "Informazioni",
    save: "SALVA",
    allergy: "Allergia",
    special: "Bisogni speciali",
    others: "Altri",
    acceptTerms:
      'Acconsento che queste informazioni siano condivise con i membri del gruppo direttamente coinvolti nelle attività di cura dei figli ("childcare") '
  },
  createActivityScreen: {
    backNavTitle: "Nuova attività"
  },
  createPlanScreen: { backNavTitle: "Nuova Plan" },
  createActivityStepper: {
    pendingMessage:
      "L'attività è in attesa di conferma da parte di un amministratore",
    continue: "Continua",
    cancel: "Cancella",
    finish: "Crea",
    save: "Salva",
    stepLabels: ["Informazioni", "Date", "Orari"]
  },
  createActivityInformation: {
    color: "Colore dell'attività",
    description: "Descrizione (facoltativo)",
    name: "Titolo dell'attività",
    location: "Posizione (facoltativo)"
  },
  createActivityDates: {
    header: "Seleziona uno o più giorni",
    repetition: "Ripetizione",
    weekly: "Settimanale",
    monthly: "Mensile",
    datesError:
      "La ripetizione non è disponibile quando sono selezionati più giorni"
  },
  createActivityTimeslots: {
    header: "Aggiungi una fascia oraria nei giorni selezionati",
    differentTimeslots: "AGGIUNGERE ORARI DIFFERENTI PER OGNI GIORNATA?",
    sameTimeslots: "STESSI ORARI PER OGNI GIORNATA?",
    selected: "date selezionate"
  },
  timeslotsContainer: {
    addTimeslot: "AGGIUNGI ORARI",
    timeslot: "orario",
    timeslots: "orari",
    confirmDialogTitle: "Confermi di eliminare questo orario?",
    timeRangeError: "Orario di inizio e fine non compatibili"
  },
  clockModal: {
    am: "AM",
    pm: "PM",
    start: "INIZIO",
    end: "FINE",
    confirm: "OK",
    cancel: "CANCELLA"
  },
  activityScreen: {
    children: "Bambini",
    volunteers: "Volontari",
    pdfToaster:
      "L'attività viene esportata in formato pdf. Lo riceverai a breve via e-mail.",
    excelToaster:
      "L'attività viene esportata in formato Excel. Lo riceverai a breve via e-mail.",
    color: "Colore",
    exportDialogTitle: "Sei sicuro di voler esportare questa attività?",
    delete: "Elimina",
    exportPdf: "Esportare Pdf",
    exportExcel: "Esportare Excel",
    every: "Ogni",
    of: "di",
    deleteDialogTitle: "Confermi di eliminare questa attività?",
    infoHeader: "Attività informative"
  },
  timeslotsList: {
    fixed: "fisso",
    completed: "completato",
    timeslot: "Orario",
    timeslots: "Orari",
    available: "disponibile",
    all: "Tutti gli orari",
    mySigned: "Le mie adesioni",
    myChildrenSigned: "Le adesioni dei miei bambini",
    enough: "Con abbastanza partecipanti",
    notEnough: "Non ci sono abbastanza volontari",
    notEnoughParticipants: "Non ci sono abbastanza partecipanti"
  },
  filterTimeslotsDrawer: {
    header: "Filtra orari",
    all: "Tutti gli orari",
    mySigned: "Le mie adesioni",
    myChildrenSigned: "Le mie bambini adesioni",
    enough: "Con abbastanza partecipanti",
    notEnough: "Senza abbastanza partecipanti"
  },
  expandedTimeslot: {
    signup: "Adesioni:",
    parents: "Genitori che partecipa",
    children: "Bambini che partecipano",
    parent: "Genitore che partecipa",
    child: "Bambino/a che partecipa",
    fixed: "Confermata",
    completed: "Completata"
  },
  expandedTimeslotEdit: {
    timeErr: "Combinazione di inizio e fine ora non valida",
    details: "Dettagli",
    from: "Da",
    to: "A",
    parents: "Genitori richiesti",
    children: "Bambini richiesti",
    footer:
      "Le modifiche saranno apportate solo a questo orario e non all'attività",
    name: "Titolo",
    location: "Luogo",
    description: "Descritzione (facoltativo)",
    cost: "Costo (facoltativo)",
    status: "Stato di questa attività",
    fixed: "Confermata",
    completed: "Completata",
    requiredErr: "Perfavore compila questo campo.",
    rangeErr: "Perfavore seleziona un valore maggiore di zero",
    learning: "attività di apprendimento / istruzione / compiti a casa",
    nature: "natura",
    tourism: "turismo e cultura",
    hobby: "hobby e sport",
    accompanying: "accompagnamento (car sharing o pedibus)",
    entertainment: "intrattenimento",
    parties: "feste o eventi",
    coplaying: "Giochi di gruppo",
    other: "altro",
    category: "Tipo di attività"
  },
  editActivityScreen: {
    backNavTitle: "Modifica attività",
    color: "Colore dell'attività",
    description: "Descrizione (facoltativo)",
    name: "Nome dell'attività",
    save: "SALVA",
    location: "Posizione (facoltativo)"
  },
  agendaView: {
    timeslots: "Orari",
    available: "disponibile",
    all: "Tutti gli orari",
    signed: "Le mie adesioni",
    enough: "Con abbastanza participanti",
    notEnough: "Senza abbastanza partecipanti",
    notEnoughParticipants: "Non ci sono abbastanza partecipanti"
  },
  confirmDialog: {
    agree: "Ok",
    disagree: "Annulla"
  },
  pendingRequestsScreen: {
    requests: "Richieste in sospeso",
    activities: "Attivita in sospeso",
    invites: "Inviti in sospeso",
    confirm: "CONFERMA",
    delete: "ELIMINA"
  },
  forgotPasswordScreen: {
    prompt:
      "Inserisci l'indirizzo e-mail per ricevere il link per cambiare la tua Password. ",
    email: "Email",
    backNavTitle: "Password dimenticata?",
    send: "INVIA",
    notExistErr: "L'utente non è registrato nella piattaforma",
    err: "Qualcosa è andato storto",
    success: "Email inviata",
    requiredErr: "Perfavore compila questo campo."
  },
  changePasswordScreen: {
    prompt: "Inserisci la password",
    password: "Password",
    confirm: "Conferma la password",
    change: "CAMBIA",
    err: "Le due password sono differenti",
    badRequest: "Richiesta errata",
    requiredErr: "Perfavore compila questo campo.",
    typeMismatchErr: "Si prega di inserire un indirizzo email valido."
  },
  calendar: {
    userCalendar: "Mio calendario",
    groupCalendar: "Calendario del gruppo"
  },
  framilyListItem: {
    delete: ""
  }
};

const el = {
  participantsModal: {
    header: "Συμμετέχοντες",
    cancel: "Απόκρυψη"
  },
  managePlanSolution: {
    needsHeader: "Ανάγκες",
    selectFrom: "Επιλογή διαθεσιμότητας από",
    participating: "Σχεδιάστε τα συμμετέχοντα μέλη",
    available: "διαθέσιμα μέλη υποδοχής",
    all: "Όλα τα μέλη της ομάδας",
    automaticSuccess: "Το σχέδιο μετατράπηκε με επιτυχία σε δραστηριότητες",
    manualSuccess:
      "Θα λάβετε σύντομα την τελική λύση του σχεδίου μέσω ηλεκτρονικού ταχυδρομείου"
  },
  groupManagementScreen: {
    backNavTitle: "Διαχείριση Ομάδας",
    totalVolunteers: "Συνολικός αριθμός εθελοντών",
    totalKids: "Συνολικός αριθμός παιδιών",
    totalEvents: "Συνολικός αριθμός δραστηριοτήτων",
    totalCompletedEvents: "Συνολικός αριθμός  ολοκληρωμένων δραστηριοτήτων",
    metricsHeader: "Μετρικές Ομάδας",
    metricsColumn: "Μετρική",
    valuesColumn: "Τιμή",
    chartHeader: "Συνολική συεισφορά ανά εθελοντή"
  },
  timeslotEmergencyScreen: {
    copy: "Ο αριθμός έκτακτης ανάγκης αντιγράφηκε στο πρόχειρο",
    call: "Κλήση",
    header: "Αριθμοί Έκτακτης Ανάγκης:",
    services: {
      general: "Έκτακτη ανάγκη",
      ambulance: "Νοσοκομείο",
      police: "Αστυνομία",
      fire: "Πυροσβεστική"
    }
  },
  editPlanScreen: {
    requiredErr: "Παρακαλώ συμπληρώσετε το πεδίο",
    learning: "Εκπαιδευτικές δραστηριότητες",
    nature: "Φύση",
    tourism: "Τουρισμός και πολιτισμός",
    hobby: "Χόμπι και αθλήματα",
    accompanying: "Συνοδεία",
    entertainment: "Διασκέδαση",
    parties: "Πάρτι ή εκδηλώσεις",
    coplaying: "Μέρες co-playing",
    other: "Άλλη",
    category: "Κατηγορία δραστηριότητας",
    backNavTitle: "Επεξεργασία Σχεδίου",
    ratio: "Αναλογία γονένων - παιδιών",
    minVolunteers: "Ελάχιστος αριθμός εθελοντών",
    deadline: "Διορία",
    needsState: "Συμπλήρωση αναγκών",
    availabilitiesState: "Συμπλήρωση διαθεσιμοτήτων",
    planningState: "Δημιουργία σχεδίου",
    creationState: "Δημιουργία Δραστηριοτήτων",
    state: "Κατάσταση σχεδίου",
    needsStateHelper:
      "Στη φάση συμπλήρωσης αναγκών οι χρήστες επιλέγουν τις ημερομηνίες που χρειάζονται παιδική μέριμνα. Σε αυτή τη φάση οι διαθεσιμότητες είναι κλειδωμένες.",
    availabilitiesStateHelper:
      "Στη φάση συμπλήρωσης διαθεσιμοτήτων οι χρήστες επιλέγουν τις ημερομηνίες που είναι διαθέσιμοι για παιδική μέριμνα. Σε αυτή τη φάση οι ανάγκες είναι κλειδωμένες.",
    planningStateHelper:
      "Σε αυτή τη φάση ο αλγόριθμος δημιουργεί ένα βέλτιστο σχέδιο με βάση τις ανάγκες και τις διαθεσιμότητες.",
    creationStateHelper:
      "Στη φάση της δημιουργίας το βέλτιστο σχέδιο μετατρέπεται σε δραστηριότητες."
  },
  createPlanStepper: {
    name: "Όνομα",
    from: "Από",
    to: "Έως",
    description: "Περιγραφή",
    location: "Τοποθεσία",
    requiredErr: "Παρακαλώ συμπληρώσετε αυτό το πεδίο.",
    deadlineErr:
      "Η προθεσμία πρέπει να είναι πριν τη καθορισμένη χρονική περίοδο.",
    rangeErr: "Μη έγκυρος συνδυασμός ημερομηνιών έναρξης και λήξης",
    continue: "Συνέχεια",
    cancel: "Ακύρωση",
    finish: "Δημιουργία",
    save: "Αποθήκευση",
    stepLabels: [
      "Παρέχετε ένα τίτλο για το σχέδιο",
      "Ορίσετε τη χρονική περίοδο",
      "Ορίσετε τη προθεσμία",
      "Συμπληρώσετε τη τοποθεσία"
    ]
  },
  managePlanScreen: {
    export: "ΕΞαγωγή Σχεδίου",
    edit: "Τροποποίηση Σχεδίου",
    delete: "Διαγραφή Σχεδίου",
    exportConfirm: "Είστε σίγουρος ότι θέλετε να εξάγετε αυτό το σχέδιο;?",
    exportToaster:
      "Το σχέδιο εξάγεται σε μορφή xls.Θα το λάβετε σύντομα μέσω email.",
    backNavTitle: "Διαχείριση Σχεδίου",
    deleteConfirm: "Είστε σίγουρος ότι θέλετε να διαγράψετε αυτό το σχέδιο;"
  },
  managePlanStepper: {
    amTimeslotFrom: "ΠΜ δραστηριότητα από",
    amTimeslotTo: "Έως",
    pmTimeslotFrom: "ΜΜ δραστηριότητα από",
    pmTimeslotTo: "Έως",
    create: "Δημιουργία",
    discard: "Απόρριψη",
    zeroVolunteersTimeslots: "Χειριστείτε timeslots χωρίς εθελοντές",
    activitiesCreation: "Δημιουργία δραστηριοτήτων",
    automatically: "Αυτόματα",
    manually: "Μη αυτόματα",
    automaticSuccess: "Το σχέδιο μετατράπηκε με επιτυχία σε δραστηριότητες",
    manualSuccess:
      "Θα λάβετε σύντομα ένα e-mail με την τελική λύση του σχεδίου",
    linkSuccess: "Θα λάβετε σύντομα ένα e-mail με τον αντίστοιχο σύνδεσμο.",
    nextPhase: "Επόμενη φάση",
    previousPhase: "Προηγούμενη φάση",
    finishPlan: "Δημιουργία δραστηριοτήτων",
    continue: "Συνέχεια",
    cancel: "Ακύρωση",
    finish: "Υποβολή",
    link: "Λήψη συνδέσμου",
    desktopPrompt:
      "Για να επεξεργαστείτε την λύση του σχεδίου θα πρέπει να επισκεφθείτε τη πλατφόρμα από τον υπολογιστή.Πατήστε για λάβετε e-mail με τη διεύθυνση της πλατφόρμας.",
    stepLabels: [
      "Προσθήκη αναγκών",
      "Προσαρμογή αναγκών",
      "Προσθήκη διαθεσιμοτήτων",
      "Προσαρμογή διαθεσιμοτήτων",
      "Διαχείριση λύσης",
      "Διαχείριση δραστηριοτήτων"
    ],
    needsDeadline: "Πρέπει να υποβάλετε τις ανάγκες σας μέχρι",
    availabilitiesDeadline: "Πρέπει να υποβάλετε τις διαθεσιμότητες σας μέχρι",
    availabilityError:
      "Δεν έχετε επιλέξει τη διαθεσιμότητα σας για την ημερομηνία",
    needError: "Δεν έχετε επιλέξει κάποιο παιδί για την ημερομηνία",
    needsSuccess: "Προσθέσατε επιτυχώς τις ανάγκες σας",
    availabilitiesSuccess: "Προσθέσατε επιτυχώς τις διαθεσιμότητες σας"
  },
  planListItem: {
    participantsNeeds: "μέλη έχουν δηλώσει ανάγκες",
    participantNeeds: "μέλος έχει δηλώσει ανάγκες",
    participantsAvailabilities: "μέλη έχουν δηλώσει διαθεσιμότητες",
    participantAvailabilities: "μέλος έχει δηλώσει διαθεσιμότητες",
    needsPhase: "Δήλωση αναγκών",
    availabilitiesPhase: "Δήλωση διαθεσιμοτήτων",
    planningPhase: "Εύρεση καλύτερης λύσης",
    creationPhase: "Μετατροπή σχεδίου σε δραστηριότητες"
  },
  communityInterface: {
    backNavTitle: "Community Interface",
    totalNumberOfUsers: "Συνολικός αριθμός χρηστών",
    totalNumberOfGroups: "Συνολικός αριθμός ομάδων",
    averageAppRating: "Αξιολόγηση εφαρμογής",
    averageNumberOfActivitiesPerGroup: "Μέσος αριθμός δραστηριοτήτων ανά ομάδα",
    averageNumberOfMembersPerGroup: "Μέσος αριθμός μελών ανά ομάδα",
    totalNumberOfChildren: "Συνολικός αριθμός παιδιών",
    analyticsHeader: "Αναλυτικά στοιχεία",
    communityGrowth: "Μηνιαία αύξηση χρηστών (%)",
    totalNumberOfGoogleSignups: "Εγγράφηκαν μέσω Google",
    totalNumberOfPlatformSignups:
      "Εγγράφηκαν μέσω της Families_Share πλατφόρμας",
    timeslot_autoconfirm: "Αυτόματη επιβεβαίωση χρονικής περιόδου",
    auto_admin: "Μέλη ομάδων αυτόματα διαχειριστές",
    metricsColumn: "Μετρική",
    valuesColumn: "Τιμή",
    configurationsHeader: "Ρυθμίσεις",
    chartsHeader: "Γραφήματα",
    charts: [
      "Συνολικός αριθμός χρηστών",
      "Αριθμός χρηστών που έχουν εγγραφεί μέσω της πλατφόρμας",
      "Αριθμός χρηστών που έχουν εγγραφεί μέσω Google",
      "Συνολικός αριθμός παιδιών",
      "Συνολικός αριθμός ομάδων",
      "Μέσος αριθμός μελών ομάδας",
      "Μέσος αριθμός δραστηριοτήτων ομάδας"
    ]
  },
  profileChildren: {
    addChildPrompt:
      "Δεν έχετε προσθέσει ακόμη παιδιά. Κάντε κλικ στο εικονίδιο για να προσθέσετε ένα νέο παιδί"
  },
  myCalendarScreen: {
    backNavTitle: "Το ημερολόγιο μου"
  },
  editTimeslotScreen: {
    learning: "Εκπαιδευτικές δραστηριότητες",
    nature: "Φύση",
    tourism: "Τουρισμός και πολιτισμός",
    hobby: "Χόμπι και αθλητισμός",
    accompanying: "Συνοδεία",
    entertainment: "Διασκέδαση",
    parties: "Πάρτυ ή εκδηλώσεις",
    coplaying: "Μέρες co-playing",
    other: "ΆΛλη",
    category: "Κατηγορία δραστηριότητας",
    addTimeslotTitle: "Νέα Χρονική Περίοδος",
    timeErr: "Μη έγκυρος συνδυασμός ώρας έναρξης και λήξης",
    details: "Λεπτομέρειες",
    from: "Από",
    to: "Προς",
    parents: "Απαιτούνται γονείς",
    children: "Απαιτούνται παιδιά",
    name: "Τίτλος",
    location: "Τοποθεσία",
    description: "Περιγραφή (προαιρετική)",
    cost: "Κόστος (προαιρετικό)",
    status: "Κατάσταση χρονικής περιόδου",
    ongoing: "Σε εξέλιξη",
    completed: "Ολοκληρωμένο",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο.",
    rangeErr: "Παρακαλούμε επιλέξετε μια τιμή μεγαλύτερη του μηδενός.",
    date: "Ημερομηνία",
    editConfirm: "Επιβεβαίωση αλλαγών;",
    crucialChangeConfirm:
      "Εάν αποθηκεύσετε αυτές τις αλλαγές όλοι οι συμμετέχοντες θα διαγραφούν. Αποθήκευση αλλαγών;",
    deleteConfirm:
      "Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή τη χρονική περίοδο;"
  },
  timeslotScreen: {
    externals: "ΕΞωτερικοί εθελοντές",
    externalAvailabilities: "Προσθέσετε διαθεσιμότητα εξωτερικών εθελοντών",
    externalPlaceholder: "Προσθέσετε εξωτερικό εθελοντή",
    allUsersAvailabilities: "Προσθέσετε τη διαθεσιμότητα των εθελοντών",
    allChildrenAvailabilities: "Προσθέσετε τη διαθεσιμότητα των παιδιών",
    parentSubscribe1: "Έχετε προσθέσει",
    parentSubscribe2: "στη δραστηριότητα",
    parentUnsubscribe1: "Έχετε αφαιρέσει",
    parentUnsubscribe2: "από τη δραστηριότητα",
    phoneConfirm: "Κλήση προς",
    copy: "Ο αριθμός αντιγράφηκε στο πρόχειρο",
    emergency: "ΕΚΤΑΚΤΗ ΑΝΑΓΚΗ",
    minimum: "ελάχιστος αριθμός",
    userAvailability: "Προσθέσετε τη διαθεσιμότητα σας:",
    childrenAvailability: "Προσθέσετε τη διαθεσιμότητα των παιδιών σας:",
    volunteer: "εθελοντής",
    volunteers: "εθελοντές",
    child: "παιδί",
    children: "παιδιά",
    signup: "",
    userSubscribe: "Έχετε προσθέσει τον εαυτό σας στη δραστηριότητα",
    userUnsubscribe: "Έχετε αφαιρέσει τον εαυτό σας από τη δραστηριότητα",
    childSubscribe1: "Έχετε προσθέσει",
    childSubscribe2: "στη δραστηριότητα",
    childUnsubscribe1: "Έχετε αφαιρέσει",
    childUnsubscribe2: "από τη δραστηριότητα",
    childSubscribeConfirm1: "Είστε σίγουρος ότι θέλετε να προσθέσετε",
    childSubscribeConfirm2: "στη δραστηριότητα;",
    childUnsubscribeConfirm1: "Είστε σίγρους ότι θέλετε να αφαιρέσετε",
    childUnsubscribeConfirm2: "από τη δραστηριότητα;",
    editConfirm: "Επιβεβαίωση αλλαγών?",
    you: "Εσείς",
    userSubscribeConfirm:
      "Είστε σίγουρος ότι θέλετε να προσθέσετε τον εαυτό σας στη δραστηριότητα;",
    userUnsubscribeConfirm:
      "Είστε σίγουρος ότι θέλετε να αφαιρέσετε τον εαυτό σας από τη δραστηριότητα;"
  },
  timeslotPreview: {
    confirmed: "Επιβεβαιωμένο",
    pending: "Αναμένει επιβεβαίωση",
    participating: "Εσείς και τα παιδιά σας συμμετέχετε",
    parentParticipating: "Συμμετέχετε",
    notParticipating: "Διαθέσιμο για νέες εγγραφές"
  },
  ratingModal: {
    title: "Πόσο θα θέλατε να βαθμολογήσετε τη πλατφόρμα Families Share;",
    rate: "Αξιολόγηση",
    rateInstruction:
      "Επιλέξετε τον αριθμό αστεριών που θα θέλατε να δώσετε στην εφαρμογή με κλίμακα από 1 έως 5."
  },
  landingHeader: { communityName: "εργάνη" },
  landingNavbar: { logIn: "ΕΙΣΟΔΟΣ", signUp: "ΕΓΓΡΑΦΗ" },
  aboutScreen: {
    findOutMore: "ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ ΣΤΗΝ ΙΣΤΟΣΕΛΙΔΑ ΜΑΣ",
    aboutHeader: "Σχετικά με το πρόγραμμα",
    privacyPolicy: "Πολιτική απορρήτου",
    familyShareSolution: "Η λύση Families_Share",
    firstParagraph:
      'Χρηματοδοτούμενο από το πρόγραμμα "Τεχνολογίες της πληροφορίας και της επικοινωνίας" της συνιστώσας "Βιομηχανική ηγεσία" του προγράμματος Horizon 2020 και από την έκκλησή του για συλλογικές πλατφόρμες ευαισθητοποίησης για την αειφορία και την κοινωνική καινοτομία, το πρόγραμμα Families_Share αναπτύσσει μια πλατφόρμα κοινωνικής δικτύωσης και ευαισθητοποίησης αφιερωμένη στην ενθάρρυνση της φροντίδας των παιδιών και της ισορροπίας μεταξύ εργασίας και προσωπικής ζωής. Η πλατφόρμα αξιοποιεί τα δίκτυα γειτονιάς και δίνει τη δυνατότητα στους πολίτες να συναντώνται για να μοιράζονται τα καθήκοντα, τον χρόνο και τις δεξιότητες που σχετίζονται με την παιδική μέριμνα και την παιδεία / ψυχαγωγία μετά το σχολείο, όπου αυτές έχουν γίνει μη προσβάσιμες σε περιόδους στασιμότητας και λιτότητας.',
    challengeHeader: "Η πρόκληση",
    secondParagraph:
      "Η ισορροπία μεταξύ επαγγελματικής και οικογενειακής ζωής έχει καταστεί ολοένα και πιο δύσκολη την τελευταία δεκαετία στην Ευρώπη. Η οικονομική κρίση είχε διπλές  συνέπειες, επηρεάζοντας τις συνθήκες αγοράς εργασίας από τη μια πλευρά και τις διατάξεις περί κοινωνικής πρόνοιας από την άλλη. Ως αποτέλεσμα, τα ποσοστά ανεργίας έχουν αυξηθεί (κυρίως στους τομείς που κυριαρχούνται από άνδρες), ενώ περισσότερες γυναίκες (συμπεριλαμβανομένων  μητέρων) εργάζονται με μερική απασχόληση. Οι σταθερές θέσεις εργασίας δεν μπορούν πλέον δεδομένες και οι επισφαλείς συμβάσεις είναι ολοένα και πιο διαδεδομένες, με πολλούς εργαζόμενους να συμμετέχουν σε προγράμματα κατάρτισης και να αντιμετωπίζουν την ανεργία. Ένα συρρικνούμενο εργατικό δυναμικό μόνιμων εργαζομένων υπόκειται σε αυξημένο φόρτο εργασίας και σε αυξημένες ώρες εργασίας, καθιστώντας την ισορροπία μεταξύ εργασίας και καθημερινής ζωής πιο δύσκολη και το παρόν  μοντέλο μη βιώσιμο.",
    fourthParagraph:
      'Το πρόγραμμα Families_Share προσφέρει μια λύση "από τα κάτω", με τη μορφή μιας κοινά σχεδιασμένης πλατφόρμας που υποστηρίζει τις οικογένειες για να μοιράζονται χρόνο και καθήκοντα που σχετίζονται με την παιδική μέριμνα, τη γονική μέριμνα, τις εξωσχολικές δραστηριότητες, τις δραστηριότητες αναψυχής και άλλα οικιακά καθήκοντα - Το πρόγραμμα φιλοδοξεί επίσης να συνεργαστεί με τους ηλικιωμένους, με την συμμετοχή τους σε δραστηριότητες παιδικής μέριμνας και προσφέροντάς τους παράλληλα υποστήριξη στα ψώνια τους και τα διάφορα καθήκοντά τους, αλλά και με τη συμμετοχή τους σε οικογενειακές εκδηλώσεις. Για να επιτύχει αυτό το στόχο, το πρόγραμμα "δανείζεται" και ενσωματώνει τις έννοιες της "χρονομετρητικής τραπεζικής" (time banking) , αξιοποιώντας τις υπάρχουσες ψηφιακές κοινωνικές καινοτομίες των εταίρων του έργου στον τομέα της παιδικής μέριμνας. Αξιοποιεί επίσης τις δυνατότητες των δικτύων τεχνολογίας πληροφοριών και επικοινωνιών (ΤΠΕ) για την αύξηση της συμμετοχικής καινοτομίας με την ενθάρρυνση της αυτορρύθμισης των γειτονιών.',
    europeanUnionText:
      "Το πρόγραμμα αυτό έλαβε χρηματοδότηση από το Ευρωπαϊκό Πρόγραμμα «Ορίζοντας 2020» της Ευρωπαϊκής Ένωσης για το Πρόγραμμα «Ορίζοντας 2020» με θέμα: ICT-11-2017 Είδος δράσης: IA, Συμφωνία επιχορήγησης αριθ. 780783",
    backNavTitle: "Σχετικά με"
  },
  landingScreen: {
    suggestionsHeader: "Ομάδες στην κοινότητα",
    cardHeader: "Σχετικά με το πρόγραμμα",
    cardInfo:
      "Το πρόγραμμα Families_Share αναπτύσσει μια πλατφόρμα κοινωνικής δικτύωσης και ευαισθητοποίησης, αφιερωμένη στην ενθάρρυνση της παιδικής μέριμνας και της ισορροπίας μεταξύ της εργασίας και της καθημερίνότητας."
  },
  logInScreen: {
    backNavTitle: "Είσοδος",
    forgotPassword: "Ξεχάσατε τον κωδικό πρόσβασης;",
    orLogInWith: "Η ΕΙΣΟΔΟΣ ΜΕ",
    google: "GOOGLE",
    facebook: "FACEBOOK",
    dontHaveAccount: "Δεν έχετε λογαριασμό;",
    signUp: "Εγγραφή",
    agreeWithTerms:
      "Με τη σύνδεση σας, δέχεστε ότι συμφωνείτε με τους όρους Χρήσης και τη Πολιτική Απορρήτου."
  },
  logInForm: {
    password: "Κωδικός πρόσβασης",
    email: " Ηλεκτρονικό ταχυδρομείο",
    confirm: "Επιβεβαίωση",
    authenticationErr:
      "Λάθος διεύθυνση  ηλεκτρονικού ταχυδρομείου ή κωδικός πρόσβασης",
    requiredErr: "Παρακαλούμε συμπληρώστε αυτό το πεδίο.",
    typeMismatchErr: "Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση e-mail.",
    tooShortErr: "Παρακαλούμε χρησιμοποιήσετε τουλάχιστον 8 χαρακτήρες."
  },
  signUpScreen: {
    backNavTitle: "Εγγραφή",
    accountQuestion: "Έχετε ήδη λογαριασμό;",
    logIn: "Είσοδος"
  },
  signUpForm: {
    email: "Ηλεκτρονικό ταχυδρομείο",
    visibilityPrompt:
      "Οι χρήστες θα μπορούν να αναζητήσουν το προφίλ μου εντός της εφαρμογής",
    givenName: "Όνομα",
    familyName: "Επίθετο",
    password: "Κωδικός πρόσβασης",
    confirmPassword: "Επιβεβαίωση κωδικού πρόσβασης",
    confirm: "ΕΠΙΒΕΒΑΙΩΣΗ",
    profileVisibility: "Το προφίλ μου εμφανίζεται στα αποτελέσματα αναζήτησης",
    termsPolicy: "Όροι και πολιτική",
    phoneNumber: "Αριθμός τηλεφώνου (προαιρετικό πεδίο)",
    confirmPasswordErr: "Οι κωδικοί πρόσβασης δεν ταιριάζουν",
    signupErr: "Ένας άλλος λογαριασμός χρησιμοποιει το e-mail ",
    acceptTermsErr: "Παρακαλούμε να αποδεχτείτε τους όρους και την πολιτική",
    requiredErr: "Παρακαλούμε συμπληρώστε αυτό το πεδίο.",
    passwordPrompt: "Ο κωδικός πρέπει να περιλαμβάνει τουλάχιστον 8 χαρακτήρες",
    typeMismatchErr: "Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση e-mail.",
    tooShortErr: "Παρακαλούμε χρησιμοποιήσετε τουλάχιστον 8 χαρακτήρες."
  },
  privacyPolicyModal: {
    privacyPolicy: (
      <div>
        <h1>Πολιτική απορρήτου Families_Share</h1>
        <p>
          Αυτή η Πολιτική απορρήτου έχει σκοπό να σας βοηθήσει να κατανοήσετε
          ποιες πληροφορίες συλλέγουμε, γιατί τις συλλέγουμε και πώς μπορείτε να
          ενημερώσετε, να διαχειριστείτε, να εξαγάγετε και να διαγράψετε τις
          πληροφορίες σας.
        </p>
        <ol type="i">
          <li>
            <h2>Πολιτική Απορρήτου Families_Share</h2>
            <p>
              Καλώς ορίσατε στον ιστότοπο του Families_Share. Αυτός ο ιστότοπος
              αναπτύχθηκε για να παρέχει πληροφορίες σχετικά με τις υπηρεσίες
              Families_Share. Η εφαρμογή Families_Share, μαζί με τον ιστότοπο,
              είναι οι "Υπηρεσίες" για επισκέπτες και χρήστες ("εσείς" και / ή
              "σας").s
            </p>
            <p>
              Αυτή η Πολιτική Απορρήτου καθορίζει την πολιτική του
              Families_Share όσον αφορά τις πληροφορίες σας, συμπεριλαμβανομένων
              των πληροφοριών που μέσω των οποίων σας προσδιορίζουν ή θα
              μπορούσαν να σας αναγνωρίσουν προσωπικά (γνωστές ως «προσωπικές
              πληροφορίες» στις ΗΠΑ ή «προσωπικά δεδομένα» στην Ευρωπαϊκή Ένωση,
              τις οποίες θα ονομάσουμε "Προσωπικά Δεδομένα ") και άλλες
              πληροφορίες που συλλέγονται από επισκέπτες και χρήστες των
              Υπηρεσιών.
            </p>
            <p>
              Διαβάστε προσεκτικά αυτήν την πολιτική απορρήτου, ώστε να
              κατανοήσετε πώς θα επεξεργαστούμε τα δεδομένα σας. Χρησιμοποιώντας
              οποιαδήποτε από τις υπηρεσίες μας, επιβεβαιώνετε ότι έχετε
              διαβάσει, κατανοήσει και αποδέχεστε αυτήν την πολιτική απορρήτου.
              Εάν δεν συμφωνείτε με αυτήν την πολιτική, παρακαλώ μην
              χρησιμοποιήσετε καμία από τις Υπηρεσίες. Αν έχετε ερωτήσεις,
              στείλτε μας email στο <bold>contact@families-share.eu</bold>
            </p>
          </li>
          <li>
            <h2>Ποιοι είμαστε</h2>
            <p>
              Είμαστε: ViLabs, ο υπεύθυνος συνεργάτης του ευρωπαϊκού
              προγράμματος Families_Share για την ανάπτυξη και τη συντήρηση της
              ιστοσελίδας και των εφαρμογών Families_Share και των αντίστοιχων
              υπηρεσιών, καθώς και του επεξεργαστή δεδομένων και του υπεύθυνου
              δεδομένων του έργου. ViLabs CY ("Ευέλικτες Καινοτομίες"),
              Επιχειρηματικό κέντρο ECASTICA 6, Βασιλική Βρυωνίδης 6, Γκάλα
              Δικαστήρια, Λεμεσός, Κύπρος t. +30 2310 365 188, +35725 760 967,
              <bold>info@vilabs.eu</bold>. Αναφερόμαστε σε αυτήν την ομάδα ως
              "ViLabs", "εμείς", "εμάς" και / ή "μας".
            </p>
          </li>
          <li>
            <h2>
              Η νομική μας κατάσταση και οι ισχύοντες νόμοι περί απορρήτου
              δεδομένων
            </h2>
            <p>
              Το ViLabs κατέχει το ρόλο του επεξεργαστή δεδομένων και του
              ελεγκτή δεδομένων σύμφωνα με τη νομοθεσία της ΕΕ. Όλα τα προσωπικά
              δεδομένα συλλέγονται, χρησιμοποιούνται, αποθηκεύονται και
              υποβάλλονται σε επεξεργασία σε πλήρη συμμόρφωση με τον κανονισμό
              για την προστασία των δεδομένων προσωπικού χαρακτήρα (Κανονισμός
              (UE) 679/2016, γνωστός και ως "GDPR") και την οδηγία 2002/58 /EC
              (Οδηγία για την ιδιωτική ζωή και τις ηλεκτρονικές επικοινωνίες).
              Μόνο οι ερευνητές του Vilabs και οι διαχειριστές του συστήματος θα
              έχουν πρόσβαση στον φάκελο δεδομένων Οι υπηρεσίες Families_Share
              φιλοξενούνται σε διακομιστές που βρίσκονται στην Ευρωπαϊκή Ένωση
              και παρέχονται από τη Contabo (https://contabo.com/).
            </p>
          </li>
          <li>
            <h2>Πληροφορίες που συλλέγουμε</h2>
            <p>
              Όταν αλληλεπιδράτε μαζί μας μέσω των Υπηρεσιών, συλλέγουμε
              Προσωπικά Δεδομένα και άλλες πληροφορίες από εσάς, όπως
              περιγράφεται παρακάτω: Συλλέγουμε προσωπικά δεδομένα από εσάς όταν
              παρέχετε εθελοντικά τέτοιες πληροφορίες, όπως όταν επικοινωνείτε
              μαζί μας με ερωτήσεις, κάνετε εγγραφή για πρόσβαση στις Υπηρεσίες
              ή χρησιμοποιείτε ορισμένες Υπηρεσίες.
            </p>
            <p>
              Συγκεκριμένα, στην πλατφόρμα Families_Share θα συγκεντρωθούν
              πληροφορίες σχετικά με τους γονείς, τα παιδιά και τις ομάδες
              παιδικής μέριμνας.
            </p>
            <ul>
              <li>
                <p>
                  &bull; Σχετικά με τους γονείς: όνομα, οικογενειακό όνομα,
                  αριθμό τηλεφώνου, διεύθυνση, email και εικόνα / avatar.
                </p>
              </li>
              <li>
                <p>
                  &bull; Σχετικά με τα παιδιά: Οι πληροφορίες συλλέγονται μόνο
                  από εκείνες που ασκούν τη γονική μέριμνα και δικαιούνται να
                  παρέχουν τις σχετικές πληροφορίες, σύμφωνα με τη σχετική
                  νομοθεσία. Οι πληροφορίες είναι: όνομα, ημερομηνία γέννησης,
                  φύλο, εικόνα / avatar και άλλες πληροφορίες που καθορίζονται
                  άμεσα από τους γονείς (αλλεργίες, ασθένειες, ειδική διατροφή,
                  ειδικές ανάγκες κ.λπ.).
                </p>
              </li>
              <li>
                <p>
                  &bull; Σχετικά με τις ομάδες παιδικής μέριμνας: το όνομα της
                  ομάδας, το bio group, η τοποθεσία που παρέχεται η παιδική
                  φροντίδα, η χρονική περίοδος της παιδικής φροντίδας και τα
                  μηνύματα στην ομάδας (κείμενο και εικόνα).
                </p>
              </li>
              <li>
                <p>
                  &bull; Τεχνικές ή άλλες λεπτομέρειες σχετικά με οποιαδήποτε
                  συσκευή χρησιμοποιείτε για την πρόσβαση στις Υπηρεσίες,
                  συμπεριλαμβανομένου του Device Unique Device Identifier (UDID)
                  ή ισοδύναμου. το λειτουργικό σας σύστημα, τον τύπο του
                  προγράμματος περιήγησης ή άλλο λογισμικό. το υλικό σας ή τα
                  στοιχεία της κινητής σας συσκευής (συμπεριλαμβανομένου του
                  τύπου και του αριθμού του κινητού σας συσκευής και του παρόχου
                  κινητής τηλεφωνίας), αν υπάρχει ή άλλες τεχνικές λεπτομέρειες.
                </p>
              </li>
              <li>
                <p>
                  &bull; Λεπτομέρειες σχετικά με τη χρήση των υπηρεσιών μας:
                  ποσοτικές πληροφορίες σχετικά με το πότε και πώς
                  χρησιμοποιείτε τις Υπηρεσίες.
                </p>
              </li>
            </ul>
            <p>
              Παρέχοντας οικειοθελώς Προσωπικά Δεδομένα, συμφωνείτε να τα
              χρησιμοποιήσουμε στο πλαίσιο των Υπηρεσιών και σύμφωνα με την
              παρούσα Πολιτική Προστασίας Προσωπικών Δεδομένων (άρθρο 6, παρ. 1,
              παρ. Α, GDPR). Παρεμπιπτόντως, η επεξεργασία των προσωπικών
              δεδομένων πρέπει επίσης να είναι νόμιμη όταν είναι απαραίτητη για
              την εκτέλεση των Υπηρεσιών (άρθρο 6, παρ. 1, παρ. Β, GDPR). Όσον
              αφορά ειδικές κατηγορίες προσωπικών δεδομένων, δίνετε ρητά τη
              συγκατάθεσή σας για την επεξεργασία αυτών των δεδομένων μόλις τα
              παρέχετε για τους σκοπούς των Υπηρεσιών.
            </p>
          </li>
          <li>
            <h2>Η χρήση των προσωπικών σας δεδομένων και άλλων πληροφοριών</h2>
            <p>
              EΚάθε πληροφορία που συλλέγεται χωρίζεται αμέσως σε (i) ένα μέρος
              που περιέχει προσωπικές (όχι ευαίσθητες) πληροφορίες (όπως όνομα,
              ηλεκτρονικό ταχυδρομείο, αριθμό τηλεφώνου κλπ.) για τους
              συμμετέχοντες και (ii) ένα μέρος το οποίο είναι πλήρως ανώνυμο (μη
              προσωπικά αναγνωρίσιμο) το οποίο έπειτα διατίθεται σε ολόκληρη την
              κοινοπραξία για ερευνητικούς σκοπούς.
            </p>
            <p>
              Τα προσωπικά δεδομένα των συμμετεχόντων σε κάθε CityLab θα
              μοιραστούν μέσω της εφαρμογής με τα υπόλοιπα μέλη της ομάδας για
              τη διαχείριση της δραστηριότητας Families_Share, υπό τον έλεγχο
              του διαχειριστή της ομάδας. Οποιαδήποτε κατάχρηση από ένα μέλος θα
              έχει ως αποτέλεσμα την ακύρωση του λογαριασμού του. Παρατηρήστε
              ότι οποιοδήποτε αίτημα συμμετοχής σε μια ομάδα υπόκειται στην
              έγκριση του διαχειριστή ομάδας. Τα πρόσθετα προσωπικά δεδομένα των
              συμμετεχόντων θα συλλέγονται όταν είναι απαραίτητο μόνο για
              επιστημονικούς σκοπούς (για παράδειγμα, σε περαιτέρω επαφές για
              διαχρονικές μελέτες) και θα διαγραφούν αμέσως μετά την ολοκλήρωση
              του έργου.Τα ανώνυμα δεδομένα αποθηκεύονται σε ένα κοινό χώρο
              αποθήκευσης και θα διατηρηθούν μετά την ολοκλήρωση του έργου ως
              απόδειξη για τις μελέτες και τις δημοσιεύσεις.
            </p>
            <p>
              Συγκεκριμένα, οι Υπηρεσίες μπορούν να χρησιμοποιούν αυτές τις
              πληροφορίες και να τις συγκεντρώνουν με άλλες πληροφορίες σε
              ανώνυμη και γενικευμένη βάση για να παρακολουθούν, για παράδειγμα,
              τον συνολικό αριθμό χρηστών, τον αριθμό επισκεπτών σε κάθε σελίδα
              του ιστότοπου και στοιχεία των παρόχων υπηρεσιών διαδικτύου των
              επισκεπτών μας (στην περίπτωση αυτή δεν υπάρχουν προσωπικά
              δεδομένα).
            </p>
          </li>
          <li>
            <h2>
              Η αποκάλυψη των προσωπικών σας δεδομένων και άλλων πληροφοριών
            </h2>
            <p>
              Οπωσδήποτε, το Families_Share (και συνεπώς ο υπεύθυνος συνεργάτης
              ViLabs) μπορεί να αποκαλύψει τα Προσωπικά σας Δεδομένα μόνο εφόσον
              το απαιτεί ο νόμος ή με πίστη ότι η ενέργεια αυτή είναι απαραίτητη
              για:
            </p>
            <ul>
              <li>
                <p> &bull; Τηρήστε μια νομική υποχρέωση</p>
              </li>
              <li>
                <p>
                  &bull; να ενεργεί σε επείγουσες περιπτώσεις για την προστασία
                  της προσωπικής ασφάλειας των χρηστών των Υπηρεσιών ή του
                  κοινού
                </p>
              </li>
              <li>
                <p> &bull; Προστασία από νομική ευθύνη </p>
              </li>
            </ul>
          </li>
          <li>
            <h2>Οι επιλογές σας</h2>
            <p>
              Μπορείτε να επισκεφθείτε τις Υπηρεσίες χωρίς να παρέχετε προσωπικά
              δεδομένα. Αν επιλέξετε να μην παρέχετε προσωπικά δεδομένα,
              ενδέχεται να μην μπορείτε να χρησιμοποιήσετε ορισμένες υπηρεσίες
              Families_Share.
            </p>
          </li>
          <li>
            <h2>Συλλογή δεδομένων</h2>
            <p>
              Όλα τα δεδομένα προέρχονται από χρήστες κατά την εγγραφή στην
              πλατφόρμα Families_Share. Τις περισσότερες φορές, οι γονείς πρέπει
              να δώσουν τη συγκατάθεσή τους στην επεξεργασία των προσωπικών και
              «ευαίσθητων» πληροφοριών για τα παιδιά τους. Συγκεκριμένα, οι
              πληροφορίες για τα παιδιά παρέχονται από τους γονείς και τα
              δεδομένα συλλέγονται δεδομένα σύμφωνα με το GDRP (άρθρο 8):
            </p>
            <ul>
              <li>
                <p>
                  &bull; Σε περίπτωση εφαρμογής του άρθρου 6 παράγραφος 1
                  στοιχείο α), όσον αφορά την προσφορά υπηρεσιών της κοινωνίας
                  της πληροφορίας απευθείας σε παιδί, η επεξεργασία των
                  δεδομένων προσωπικού χαρακτήρα ενός παιδιού είναι νόμιμη όταν
                  το παιδί είναι τουλάχιστον 16 ετών. Όταν το παιδί είναι κάτω
                  από την ηλικία των 16 ετών, η επεξεργασία αυτή είναι νόμιμη
                  μόνον εάν και στο βαθμό που η συγκατάθεση παρέχεται ή
                  εγκρίνεται από τον κάτοχο της γονικής μέριμνας.
                </p>
              </li>
              <li>
                <p>
                  &bull;Ο υπεύθυνος επεξεργασίας καταβάλλει εύλογες προσπάθειες
                  για να επαληθεύσει σε τέτοιες περιπτώσεις ότι η συγκατάθεση
                  για το τέκνο παρέχεται ή εγκρίνεται από τον κάτοχο της γονικής
                  μέριμνας, λαμβανομένης υπόψη της διαθέσιμης τεχνολογίας.
                </p>
              </li>
              <li>
                <p>
                  &bull; Η παράγραφος 1 δεν θίγει το γενικό δίκαιο των συμβάσεων
                  των κρατών μελών, όπως είναι οι κανόνες σχετικά με το κύρος,
                  τη σύσταση ή το αποτέλεσμα μιας σύμβασης σε σχέση με ένα
                  παιδί. "
                </p>
              </li>
            </ul>
            <p>
              Θυμηθείτε επίσης το σημείο 32 του GDPR: "Η συγκατάθεση πρέπει να
              δίνεται με σαφή καταφατική πράξη, η οποία να καθιερώνει ελεύθερη,
              συγκεκριμένη, ενημερωμένη και σαφή ένδειξη της συμφωνίας του
              υποκειμένου των δεδομένων για την επεξεργασία των προσωπικών
              δεδομένων που τον αφορούν, όπως με γραπτή δήλωση, με ηλεκτρονικά
              μέσα, ή προφορική δήλωση. Αυτό θα μπορούσε να περιλαμβάνει την
              τοποθέτηση ενός κουτιού κατά την επίσκεψη σε μια ιστοσελίδα στο
              διαδίκτυο, την επιλογή τεχνικών ρυθμίσεων για τις υπηρεσίες της
              κοινωνίας της πληροφορίας ή άλλη δήλωση ή συμπεριφορά που
              υποδεικνύει σαφώς στο πλαίσιο αυτό την αποδοχή της προτεινόμενης
              επεξεργασίας των προσωπικών δεδομένων [...] η συγκατάθεση του
              υποκειμένου των δεδομένων πρέπει να δίδεται μετά από αίτημα με
              ηλεκτρονικά μέσα, το αίτημα πρέπει να είναι σαφές, συνοπτικό και
              να μην παρεμποδίζει αδικαιολόγητα τη χρήση της υπηρεσίας για την
              οποία παρέχεται ".
            </p>
          </li>
          <li>
            <h2>Παιδιά</h2>
            <p>
              ο Families_Share δεν συλλέγει εν γνώσει του τα Προσωπικά Δεδομένα
              που παρέχονται από τα παιδιά κάτω των 16 ετών. Εάν είστε κάτω από
              την ηλικία των 16 ετών, παρακαλούμε μην υποβάλετε Προσωπικά
              Δεδομένα μέσω των Υπηρεσιών. Ενθαρρύνουμε τους γονείς και τους
              νόμιμους κηδεμόνες να παρακολουθούν τη χρήση του Διαδικτύου των
              παιδιών τους και να βοηθούν στην επιβολή της Πολιτικής Προστασίας
              Προσωπικών Δεδομένων, δίνοντας εντολή στα παιδιά τους να μην
              παρέχουν ποτέ προσωπικά δεδομένα για τις Υπηρεσίες χωρίς την άδειά
              τους. Εάν έχετε λόγο να πιστεύετε ότι ένα παιδί κάτω των 16 ετών
              έχει παράσχει προσωπικά δεδομένα στο Families_Share μέσω των
              Υπηρεσιών, επικοινωνήστε μαζί μας και θα προσπαθήσουμε να
              διαγράψουμε αυτές τις πληροφορίες από τις βάσεις δεδομένων μας.
            </p>
          </li>
          <li>
            <h2>Στρατηγική αποθήκευσης δεδομένων και συντήρησης</h2>
            <p>
              Οι συνολικές υπηρεσίες Families_Share προσφέρονται μέσω του cloud
              και τόσο το πίσω όσο και το μπροστινό μέρος της πλατφόρμας και τα
              δεδομένα αποθηκεύονται σε ασφαλείς και προστατευμένους
              αποκλειστικούς διακομιστές μέσω ενός πιστοποιημένου παρόχου cloud
              που διαθέτει όλες τις απαραίτητες υποδομές και πιστοποιήσεις που
              απαιτούνται από το GDPR.
            </p>
            <p>
              Ο πάροχος υπηρεσιών cloud διοικείται από υπεύθυνο άτομο από την
              VILABS και από ειδικό υπεύθυνο προστασίας δεδομένων (Coordinator
              του έργου Prof. Agostino Cortesi, Universita Ca'Foscari Venezia,
              <bold>cortesi@unive.it</bold>), ακολουθώντας τις βέλτιστες
              πρακτικές και τα διαθέσιμα πρότυπα.
            </p>
            <p>
              Τα προσωπικά δεδομένα θα αποθηκεύονται καθ 'όλη τη διάρκεια του
              επίσημου κύκλου ζωής του έργου Horizon 2020, χρηματοδοτούμενο από
              την ΕΕ Families_Share, μέχρι τις 31/10/2020. Μετά το τέλος της
              επίσημης περιόδου του έργου, τα προσωπικά δεδομένα των χρηστών που
              δεν έχουν συνδεθεί στον λογαριασμό τους για ένα έτος (365 ημέρες)
              θα διαγραφούν πλήρως.
            </p>
            <p>
              Ο προστατευόμενος χώρος αποθήκευσης του παρόχου υπηρεσιών Cloud θα
              βασίζεται σε πλεονάζοντα συστήματα και θα βρίσκεται στην ΕΕ. Τα
              δεδομένα υποστηρίζονται καθημερινά και ένα αντίγραφο ασφαλείας
              αποθηκεύεται ξανά σε κέντρα δεδομένων στην ΕΕ
            </p>
            <p>
              Η πρόσβαση στα δεδομένα του αποθηκευτικού χώρου υπόκειται σε
              έλεγχο ταυτότητας χρησιμοποιώντας το όνομα χρήστη και τον κωδικό
              πρόσβασης του διαχειριστή σύμφωνα με την οδηγία 2002/58 / ΕΚ του
              Ευρωπαϊκού Κοινοβουλίου.
            </p>
            <p>
              Μόνο οι ερευνητές του ViLabs (για σκοπούς έρευνας) και οι
              διαχειριστές του συστήματος (για λόγους συντήρησης) θα έχουν
              πρόσβαση στον φάκελο δεδομένων.
            </p>
          </li>
          <li>
            <h2>Διαβίβαση δεδομένων σε τρίτους</h2>
            <p>
              Κανένα από τα προσωπικά δεδομένα που συλλέγονται δεν θα μοιραστεί
              με τρίτους. Οι συλλεγείσες πληροφορίες θα χρησιμοποιηθούν μόνο
              στην ίδια πλατφόρμα, όπως περιγράφεται παραπάνω (V.)
            </p>
            <p>
              Η εφαρμογή δεν κάνει χρήση της χρήσης σιωπηρών "προθέσεων". Αυτό
              εμποδίζει την πρόσβαση των δεδομένων από άλλες εφαρμογές που είναι
              εγκατεστημένες στην ίδια συσκευή.
            </p>
          </li>
          <li>
            <h2>Ασφάλεια</h2>
            <p>
              Η ViLabs λαμβάνει εύλογα μέτρα για την προστασία των Προσωπικών
              Δεδομένων που παρέχονται μέσω των Υπηρεσιών από απώλεια, κακή
              χρήση και μη εξουσιοδοτημένη πρόσβαση, αποκάλυψη, τροποποίηση ή
              καταστροφή. Η επικοινωνία δεδομένων από / προς τον χρήστη θα
              γίνεται μέσω του πρωτοκόλλου που βασίζεται στο SSL.
            </p>
            <p>
              Είναι δική σας ευθύνη να προστατεύσετε σωστά την πρόσβαση στη
              συσκευή όπου είναι εγκατεστημένη η εφαρμογή έναντι μη
              εξουσιοδοτημένης χρήσης.
            </p>
            <p>
              Οι εγγεγραμμένοι χρήστες Families_Share θα έχουν ένα όνομα χρήστη
              και ένα μοναδικό αναγνωριστικό, το οποίο σας επιτρέπει να έχετε
              πρόσβαση σε ορισμένα τμήματα των Υπηρεσιών μας. Είστε υπεύθυνοι
              για την εμπιστευτική φύλαξή τους. Βεβαιωθείτε ότι δεν τις
              μοιράζεστε με κανέναν άλλο
            </p>
          </li>
          <li>
            <h2>Τα δικαιώματά σας - Κλείσιμο του λογαριασμού σας</h2>
            <p>
              Η νομοθεσία της ΕΕ για την προστασία των δεδομένων παρέχει στους
              πολίτες της ΕΕ το δικαίωμα πρόσβασης στις πληροφορίες που τους
              αφορούν. Αυτές οι πληροφορίες αναφέρονται παραπάνω και μπορούν να
              επεξεργαστούν από εσάς μέσω των υπηρεσιών, σύμφωνα με το GDPR
              (άρθρα 15-22). Επιπλέον, έχετε το δικαίωμα να διορθώσετε, το
              δικαίωμα ανάκλησης της συναίνεσης (όταν η συγκατάθεση είναι η
              νόμιμη βάση για την επεξεργασία των προσωπικών δεδομένων), το
              δικαίωμα διαγραφής («δικαίωμα να ξεχαστεί»), το δικαίωμα
              περιορισμού της επεξεργασίας, το δικαίωμα στη δυνατότητα μεταφοράς
              δεδομένων, το δικαίωμα αντίρρησης στη μεταποίηση, το δικαίωμα να
              μην υπόκειται σε απόφαση που βασίζεται στην αυτοματοποιημένη
              επεξεργασία (συμπεριλαμβανομένης της μορφοποίησης), το δικαίωμα
              υποβολής καταγγελίας σε εποπτική αρχή, το δικαίωμα αποτελεσματικής
              ένδικης προσφυγής.
            </p>
            <p>
              Μπορείτε να μας στείλετε email στο
              <bold>contact@families-share.eu</bold>
            </p>
            <p>
              Όλοι οι χρήστες μπορούν να αλλάξουν τα προσωπικά τους στοιχεία
              όπως επιθυμούν, έχουν πρόσβαση και μπορούν να κατεβάσουν αντίγραφο
              των πληροφοριών τους και τη συμμετοχή τους σε δραστηριότητες μέσω
              της εφαρμογής Families_Share, ενώ έχουν επίσης το δικαίωμα να
              διαγράψουν πλήρως τον λογαριασμό τους και όλες τις πληροφορίες που
              σχετίζονται με τον λογαριασμό τους.
            </p>
            <p>
              Μετά την ακύρωση του λογαριασμού από τον χρήστη, εκτός από την
              περίπτωση ανώνυμων δεδομένων, υπάρχει υποχρέωση για την κατάργηση
              των προσωπικών δεδομένων το συντομότερο δυνατόν, καθώς η νομική
              βάση για περαιτέρω επεξεργασία θα έπρεπε να έχει εξαφανιστεί.
            </p>
            <p>
              Μπορείτε επίσης να μας στείλετε μήνυμα ηλεκτρονικού ταχυδρομείου
              στη διεύθυνση <bold>contact@families-share.eu</bold> για να
              ζητήσετε να διαγράψουμε τα προσωπικά σας στοιχεία από τη βάση
              δεδομένων μας.
            </p>
          </li>
          <li>
            <h2>Αλλαγές στην Πολιτική Απορρήτου</h2>
            <p>
              Αυτή η Πολιτική Απορρήτου μπορεί να αλλάζει από καιρό σε καιρό.
              Όταν γίνουν αλλαγές, η ημερομηνία ισχύος που αναφέρεται παρακάτω
              θα αλλάξει αναλόγως και η νέα Πολιτική Απορρήτου θα δημοσιευθεί
              ηλεκτρονικά, ενώ όλα τα εμπλεκόμενα μέρη θα λάβουν ειδική
              ειδοποίηση.
            </p>
          </li>
          <li>
            <h2>Επικοινωνία</h2>
            <p>
              Για οποιεσδήποτε άλλες πληροφορίες σχετικά με εμάς, επισκεφθείτε
              την ιστοσελίδα μας: https://www.families-share.eu/
            </p>
            <p>
              Επίσης, παρακαλούμε να επικοινωνήσετε μαζί μας αν έχετε ερωτήσεις
              σχετικά με την Πολιτική Απορρήτου του Families_Share ή τις
              πρακτικές πληροφόρησης των Υπηρεσιών. Μπορείτε να επικοινωνήσετε
              μαζί μας ως εξής: contact@families-share.eu
            </p>
          </li>
          <li>
            <h2>Διαχείριση δεδομένων</h2>
            <p>
              ΥΠΔ: Συντονιστής έργου Καθ. Agostino Cortesi, Πανεπιστήμιο
              Ca'Foscari της Βενετίας, ,<bold>cortesi@unive.it</bold>
            </p>
            <p>
              Διαχειριστής Δεδομένων Πλατφόρμας: Απόστολος Βόντας, Διευθυντής
              ViLabs,
              <bold>avontas@vilabs.eu</bold>
            </p>
            <p>
              Ελεγκτής δεδομένων: Απόστολος Βόντας, Διευθυντής ViLabs,
              <bold>avontas@vilabs.eu</bold>
            </p>
          </li>
        </ol>
        <p>
          Πατώντας το κουμπί Αποδοχή, επιβεβαιώνω ότι έχω διαβάσει, καταλάβει
          και συμφωνώ με τη Πολιτική προστασίας Προσωπικών Δεδομένων.
        </p>
      </div>
    ),
    accept: "ΑΠΟΔΟΧΗ"
  },
  groupAbout: { memberHeader: "Πληροφορίες", header: "Σχετικά με την ομάδα" },
  groupActivities: {
    exportConfirm:
      "Είστε σίγουροι ότι θέλετε να εξάγετε το ημερολόγιο της ομάδας",
    activitiesHeader: "Δραστηριότητες της ομάδας",
    plansHeader: "Εκκρεμή σχέδια",
    export: "Εξαγωγή Ημερολογίου",
    newPlan: "Νέο σχέδιο",
    newActivity: "Νέα δραστηριότητα"
  },
  activityListItem: {
    every: "Κάθε",
    of: "του"
  },
  groupListItem: {
    open: "Η συμμετοχή στην ομάδα είναι ανοιχτή.",
    closed: "Η συμμετοχή στην ομάδα είναι κλειστή.",
    members: "Μέλη",
    kids: "Παιδιά"
  },
  groupInfo: {
    contact: "ΕΠΙΚΟΙΝΩΝΙΑ",
    contactMessage: "Τα στοιχεία επικοινωίας αντιγράφηκαν στο πρόχειρο",
    startGuideHeader: "Δεν ξέρετε από πού να ξεκινήσετε;",
    startGuideInfo: "Αναζητήστε τον οδηγό έναρξης 7 βημάτων",
    join: "Συμμετοχή στην ομάδα",
    leave: "Αποχώρηση από την ομάδα",
    pending: "Ακύρωση αιτήματος",
    confirm: "Είστε βέβαιοι ότι θέλετε να αποχωρήσετε από την ομάδα;"
  },
  groupNavbar: {
    chatTab: "Μηνύματα",
    activitiesTab: "Δραστηριότητες",
    membersTab: "Μέλη",
    infoTab: "Σχετικά με",
    calendarTab: "Ημερολόγιο"
  },
  groupMembersAdminOptions: {
    invite: "Προσκαλέστε άτομα",
    groupIsOpen: "Η ομάδα είναι ανοιχτή",
    groupIsClosed: "Η ομάδα είναι κλειστή",
    requestsOpen: "Αιτήματα συμμετοχής είναι ευπρόσδεκτα",
    requestsClosed: "Έχει επιτευχθεί μέγιστη χωρητικότητα"
  },
  inviteModal: {
    memberHeader: "Προσκαλέστε άτομα",
    parentHeader: "Προσθήκη γονέα",
    framilyHeader: "Προσθήκη φίλου",
    invite: "ΠΡΟΣΚΛΗΣΗ",
    add: "ΠΡΟΣΘΗΚΗ",
    cancel: "ΑΚΥΡΩΣΗ",
    search: "Αναζήτηση"
  },
  groupNewsNavbar: {
    parents: "ΓΟΝΕΙΣ",
    children: "ΠΑΙΔΙΑ"
  },
  cardWithLink: { learnMore: "ΜΑΘΕΤΕ ΠΕΡΙΣΣΟΤΕΡΑ" },
  memberContact: {
    administrator: "Διαχειριστής ομάδας",
    addAdmin: "Προσθήκη διαχειριστή",
    removeAdmin: "Κατάργηση διαχειριστή",
    removeUser: "Κατάργηση χρήστη"
  },
  startUpGuide: {
    backNavTitle: "Οδηγός εκκίνησης",
    guide: [
      { main: "Ξεκινήστε την πρωτοβουλία στον κύκλο σας", secondary: null },
      { main: "Συνδέστε τους πρώτους ενθουσιώδεις", secondary: null },
      { main: "Επικοινωνείστε με τη τοποθεσία", secondary: null },
      { main: "Κάντε εσωτερικά ραντεβού", secondary: null },
      {
        main: "Κλείστε την ατζέντα /Επιβεβαιώστε την αντζέντα",
        secondary: null
      },
      { main: "Ξεκινήστε!", secondary: null },
      { main: "Καλώς ήρθατε", secondary: null }
    ]
  },
  notificationScreen: { backNavTitle: "Ειδοποήση" },
  myFamiliesShareHeader: {
    confirmDialogTitle:
      "Επιθυμείτε να σας στείλουμε ένα εγχειρίδιο χρήσης της πλατφόρμας στο e-mail σας;",
    walkthrough: "Εγχειρίδιο Χρήσης",
    rating: "Βαθμολογήστε μας",
    header: "Το Families Share μου ",
    homeButton: "Αρχική σελίδα",
    myProfile: "Το προφίλ μου",
    myCalendar: "Το ημερολόγιο μου",
    createGroup: "Δημιουργήστε μια ομάδα",
    searchGroup: "Αναζήτηστε  μια ομάδα",
    inviteFriends: "Προσκαλέστε φίλους",
    faqs: "Συχνές ερωτήσεις",
    about: "Σχετικά με",
    signOut: "Αποσύνδεση",
    language: "Γλώσσα",
    export: "Εξαγωγή των δεδομένων μου",
    community: "Κοινότητα"
  },
  myFamiliesShareScreen: {
    myGroups: "Οι ομάδες μου",
    myActivities: "Οι δραστηριότητες μου",
    myNotifications: "Οι ειδοποιήσεις μου",
    myGroupsPrompt:
      "Δεν έχετε γίνει μέλος κάποια ομάδας ακόμη, χρησιμοποιείστε το πλαϊνό μενού για να βρείτε μια ομάδα",
    myActivitiesPrompt:
      "Εδώ θα βλέπετε μελλοντικά τις δραστηριότητες, στις οποίες έχετε εγγραφεί.",
    joinPrompt: "ΓΙΝΕΤΕ ΜΕΛΟΣ ΜΙΑΣ ΟΜΑΔΑΣ",
    createPrompt: "ΔΗΜΙΟΥΡΓΕΙΣΤΕ ΜΙΑ ΝΕΑ ΟΜΑΔΑ"
  },
  faqsScreen: {
    backNavTitle: "Συχνές ερωτήσεις"
  },
  searchGroupModal: {
    search: "Αναζήτηση ομάδας",
    results: "Αποτελέσματα",
    example: "π.χ. Δραστηριότητες μετά το σχολείο"
  },
  createGroup: { backNavTitle: "Δημιουργία ομάδας" },
  createGroupStepper: {
    contactInfo: "Παρακαλώ συμπληρώσετε τα στοιχεία επικοινωνίας σας",
    contactTypes: {
      none: " - ",
      email: "E-mail",
      phone: "Τηλέφωνο"
    },
    continue: "Συνέχεια",
    cancel: "Ακύρωση",
    finish: "Τέλος",
    stepLabels: [
      "Δώστε ένα όνομα και μια περιγραφή",
      "Ορίστε την ορατότητα",
      "Δώστε την περιοχή",
      "Δώστε στοιχεία επικοινωνίας",
      "Προσκαλέστε άτομα"
    ],
    name: "Όνομα",
    description: "Περιγραφή",
    visibleGroup: "Άλλοι μπορούν να βρουν την ομάδα μου",
    invisibleGroup: "Άλλοι δεν μπορούν να βρουν την ομάδα μου",
    area: "Περιοχή",
    invite: "Προσθήκη μελών",
    nameErr: "Το όνομα της ομάδας υπάρχει ήδη",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  profileNavbar: { framily: "ΦΙΛΟΙ", info: "ΠΛΗΡΟΦΟΡΙΕΣ", children: "ΠΑΙΔΙΑ" },
  profileInfo: {
    description: "Περιγραφή",
    adress: "Διεύθυνση",
    email: "Προσωπικό",
    mobile: "Κινητό (τηλέφωνο)",
    home: "Σταθερό (τηλέφωνο)",
    unspecified: "Απροσδιόριστο"
  },
  profileScreen: { privateProfile: "Το προφίλ είναι ιδιωτικό" },
  editProfileScreen: {
    whatsappOption: "WhatsApp",
    viberOption: "Viber",
    emailOption: "Email",
    description: "Συμπληρώσετε μια προαιρετική περιγραφή",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    header: "Επεξεργασία προφίλ",
    name: "Όνομα",
    surname: "Επίθετο",
    phoneNumber: "Αριθμός τηλεφώνου ",
    phoneLabel: "Επιγραφή / Ετικέτα",
    street: "Οδός",
    streetNumber: "Αριθμός",
    country: "Χώρα",
    city: "Πόλη",
    email: "Διεύθυνση ηλεκτρονικού ταχυδρομείου ",
    mobile: "Κινητό (τηλέφωνο)",
    home: "Σταθερό (τηλέφωνο)",
    unspecified: "Απροσδιόριστο",
    visible: "Ορατό προφίλ",
    invisible: "Κρυφό προφίλ",
    cityErr: "Η πόλη δεν υπάρχει",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  editGroupScreen: {
    email: "E-mail",
    phone: "Τηλέφωνο",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    none: " - ",
    header: "Επεξεργασία ομάδας",
    name: "Όνομα",
    description: "Περιγραφή",
    file: "Ανεβάστε",
    area: "Περιοχή",
    nameErr: "Το όνομα της ομάδας υπάρχει ήδη",
    visible: "Ορατή ομάδα",
    invisible: "Κρυφή ομάδα",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  profileHeader: {
    export: "Εξαγωγή",
    delete: "Διαγραφή",
    signout: "Αποσύνδεση",
    exportDialogTitle:
      "Είστε σίγουροι ότι θέλετε να εξάγετε όλα τα προσωπικά σας δεδομένα;",
    deleteDialogTitle:
      "Είστε σίγουροι ότι θέλετε να διαγράψετε το λογαριασμό σας;",
    suspend: "Αναστολή",
    suspendDialogTitle:
      "Είστε σίγουροι ότι θέλετε να αναστείλετε προσωρινά το προφίλ σας;",
    suspendSuccess:
      "Ο λογαριασμός σας απενεργοποιήθηκε προσωρινά. Την επόμενη φορά που θα συνδεθείτε θα επανεργοποιηθεί.",
    exportSuccess:
      "Θα λάβετε σύντομα ένα e-mail με όλα τα προσωπικά σας δεδομένα",
    error: "Κάτι πήγε στραβά."
  },
  replyBar: {
    new: "Νέο μήνυμα",
    maxFilesError: "Παρακαλούμε επιλέξετε μέχρι 3 αρχεία."
  },
  announcementReplies: { new: "Το σχόλιο σας…" },
  reply: {
    confirmDialogTitle:
      "Είστε σίγουροι ότι θέλετε να διαγράψετε την απάντησή σας;"
  },
  groupHeader: {
    confirmDialogTitle: "Είστε σίγουροι ότι θέλετε να διαγράψετε την ομάδα σας;"
  },
  announcementHeader: {
    confirmDialogTitle: "Είστε σίγουροι ότι θέλετε να το διαγράψετε;"
  },
  childListItem: { boy: "Αγόρι", girl: "Κορίτσι", age: "χρονών" },
  childProfileHeader: {
    delete: "Διαγραφή παιδιού",
    confirmDialogTitle: "Είστε σίγουροι ότι θέλετε να διαγράψετε το παιδί;"
  },
  childProfileInfo: {
    confirmDialogTitle:
      "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το γονέα;",
    boy: "Αγόρι",
    girl: "Κορίτσι",
    unspecified: "Απροσδιόριστο",
    age: "χρονών",
    additional: "Επιπλέον πληροφορίες",
    allergies: "Αλλεργίες",
    otherInfo: "Άλλες πληροφορίες",
    specialNeeds: "Ειδικές ανάγκες",
    addAdditional: "ΠΡΟΣΘΗΚΗ",
    addParent: "ΠΡΟΣΘΗΚΗ ΓΟΝΕΑ"
  },
  editChildProfileScreen: {
    backNavTitle: "Επεξεργασία προφίλ",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    name: "Όνομα",
    surname: "Επίθετο",
    birthday: "Ημερομηνία Γέννησης",
    gender: "Φύλο",
    additional: "Προσθέστε συγκεκριμένες πληροφορίες",
    example: "π.χ. δυσανεξία σε τρόφιμα",
    boy: "Αγόρι",
    girl: "Κορίτσι",
    date: "Ημερομηνία",
    add: "Επεξεργασία",
    month: "Μηνών ",
    year: "Ετών",
    file: "Επιλέξτε αρχείο",
    unspecified: "Απροσδιόριστο",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  createChildScreen: {
    backNavTitle: "Προσθήκη παιδιού",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    name: "Όνομα",
    surname: "Επίθετο",
    birthday: "Ημερομηνία Γέννησης",
    gender: "Φύλο",
    additional: "Προσθέστε συγκεκριμένες πληροφορίες",
    add: "Προσθήκη ",
    edit: "Επεξεργασία",
    example: "π.χ. δυσανεξία σε τρόφιμα",
    boy: "Αγόρι",
    girl: "Κορίτσι",
    date: "Ημερομηνία",
    month: "Μηνών ",
    year: "Ετών",
    acceptTerms:
      "Αποδέχομαι τους Όρους Χρήσης και την Πολιτική όσον αφορά την επεξεργασία και τη χρήση των δεδομένων μου.",
    acceptTermsErr: "Παρακαλούμε αποδεχτείτε τους όρους",
    unspecified: "Απροσδιόριστο",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  additionalInfoScreen: {
    backNavTitle: "Πληροφορίες",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    allergy: "Αλλεργίες",
    special: "Ειδικές ανάγκες",
    others: "Άλλα",
    acceptTerms:
      "Αναγνωρίζω ότι αυτές οι πληροφορίες θα γνωστοποιηθούν στα μέλη της ομάδας που συμμετέχουν άμεσα στις δραστηριότητες παιδικής μέριμνας."
  },
  createActivityScreen: { backNavTitle: "Νέα δραστηριότητα" },
  createPlanScreen: { backNavTitle: "Νεο Πρόγραμμα" },
  createActivityStepper: {
    pendingMessage:
      "Η δραστηριότητα επίκειται επιβεβαίωσης από κάποιον διαχειριστή",
    continue: "Συνέχεια",
    cancel: "Ακύρωση",
    finish: "Δημιουργία",
    save: "Αποθήκευση",
    stepLabels: ["Πληροφορίες", "Ημερομηνίες", "Χρονική περίοδος"]
  },
  createActivityInformation: {
    color: "Χρώμα δραστηριότητας",
    description: "Περιγραφή (προαιρετική)",
    name: "Όνομα δραστηριότητας",
    location: "Τοποθεσία (προαιρετική)"
  },
  createActivityDates: {
    header: "Επιλέξτε μία ή περισσότερες ημέρες",
    repetition: "Επανάληψη",
    weekly: "Εβδομαδιαία",
    monthly: "Μηνιαία",
    datesError:
      "Η επανάληψη δεν είναι διαθέσιμη όταν έχετε επιλέξει πολλές ημέρες"
  },
  createActivityTimeslots: {
    header: "Προσθέστε χρονική περίοδο στις επιλεγμένες ημέρες",
    differentTimeslots: "ΔΙΑΦΟΡΕΤΙΚΗ ΧΡΟΝΙΚΗ ΠΕΡΙΟΔΟΣ ΓΙΑ ΚΑΘΕ ΗΜΕΡΑ;",
    sameTimeslots: "ΙΔΙΑ ΧΡΟΝΙΚΗ ΠΕΡΙΟΔΟΣ ΓΙΑ ΚΆΘΕ ΗΜΕΡΑ;",
    selected: "ημερομηνίες επιλέχθηκαν"
  },
  timeslotsContainer: {
    addTimeslot: "Προσθήκη χρονικής περιόδου",
    timeslot: "Χρονική περίοδος",
    timeslots: "Χρονικές περίοδοι",
    confirmDialogTitle:
      "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την χρονική περίοδο;",
    timeRangeError: "Μη έγκυρος συνδυασμός χρόνου έναρξης και λήξης"
  },
  clockModal: {
    am: "π.μ.",
    pm: "μ.μ.",
    start: "ΞΕΚΙΝΗΣΤΕ",
    end: "ΤΕΛΟΣ",
    confirm: "ΟΚ",
    cancel: "ΑΚΥΡΩΣΗ"
  },
  activityScreen: {
    children: "Παιδιά",
    volunteers: "Εθελοντές",
    pdfToaster:
      "Η δραστηριότητα εξάγεται σε μορφή pdf. Θα τη παραλάβετε σύντομα μέσω e-mail.",
    excelToaster:
      "Η δραστηριότητα εξάγεται σε μορφή excel. Θα τη παραλάβετε σύντομα μέσω e-mail.",
    color: "Χρώμα δραστηριότητας",
    exportDialogTitle:
      "Είστε σίγουροι ότι θέλετε να εξάγετε αυτήν τη δραστηριότητα;",
    exportPdf: "Εξαγωγή Pdf",
    exportExcel: "Εξαγωγή Excel",
    delete: "Διαγραφή",
    every: "Κάθε",
    of: "του",
    deleteDialogTitle:
      "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν τη δραστηριότητα;",
    infoHeader: "Πληροφορίες Δραστηριότητας"
  },
  timeslotsList: {
    fixed: "καθορισμένη",
    completed: "ολοκληρωμένη",
    timeslot: "Χρονική περίοδος",
    timeslots: "Χρονικές περίοδοι",
    available: "Διαθέσιμο",
    all: "Όλες οι χρονικές περίοδοι",
    mySigned: "Η εγγραφή μου",
    myChildrenSigned: "Οι εγγραφές των παιδιών μου",
    enough: "Με αρκετούς συμμετέχοντες",
    notEnough: "Χωρίς αρκετούς συμμετέχοντες",
    notEnoughParticipants: "Δεν υπάρχουν αρκετοί συμμετέχοντες"
  },
  filterTimeslotsDrawer: {
    header: "Φίλτρα χρονικής περιόδου",
    all: "Όλες οι χρονικές περίοδοι",
    mySigned: "Η εγγραφή μου",
    myChildrenSigned: "Οι εγγραφές των παιδιών μου",
    enough: "Με αρκετούς συμμετέχοντες",
    notEnough: "Χωρίς αρκετούς συμμετέχοντες"
  },
  expandedTimeslot: {
    signup: "Εγραφή:",
    parents: "Εγγραφή γονέων",
    children: "Εγγραφή παιδιών",
    parent: "Εγγραφή γονέα",
    child: "Εγγραφή παιδιού",
    fixed: "Σταθερό / Κανονισμένο",
    completed: "Ολοκληρωμένο "
  },
  expandedTimeslotEdit: {
    timeErr: "Μη έγκυρος συνδυασμός ώρας έναρξης και λήξης",
    details: "Λεπτομέρειες",
    from: "Από",
    to: "Προς",
    parents: "Απαιτούνται γονείς",
    children: "Απαιτούνται παιδιά",
    footer:
      "Οι αλλαγές θα γίνουν μόνο σε αυτήν την χρονική περίοδο και όχι στη δραστηριότητα",
    name: "Τίτλος",
    location: "Τοποθεσία",
    description: "Περιγραφή (προαιρετική)",
    cost: "Κόστος (προαιρετικό)",
    status: "Κατάσταση χρονικής περιόδου",
    fixed: "Κανονισμένο",
    completed: "Ολοκληρωμένο ",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο.",
    rangeErr: "Παρακαλούμε επιλέξετε μια τιμή μεγαλύτερη του μηδενός.",
    learning: "Εκπαιδευτικές δραστηριότητες",
    nature: "Φύση",
    tourism: "Τουρισμός και πολιτισμός",
    hobby: "Χόμπι και αθλητισμός",
    accompanying: "Συνοδεία",
    entertainment: "Διασκέδαση",
    parties: "Πάρτυ ή εκδηλώσεις",
    coplaying: "Μέρες co-playing",
    other: "ΆΛλη",
    category: "Κατηγορία δραστηριότητας"
  },
  editActivityScreen: {
    backNavTitle: "Επεξεργασία δραστηριότητας",
    color: "Χρώμα  δραστηριότητας",
    description: "Περιγραφή (προαιρετική)",
    name: "Όνομα δραστηριότητας",
    save: "ΑΠΟΘΗΚΕΥΣΗ",
    location: "Τοποθεσία (προαιρετική)"
  },
  agendaView: {
    timeslots: "Χρονικές περίοδοι",
    available: "διαθέσιμο",
    all: "Όλες οι χρονικές περίοδοι",
    signed: "Η εγγραφή μου",
    enough: "Με αρκετούς συμμετέχοντες",
    notEnough: "Χωρίς αρκετούς συμμετέχοντες",
    notEnoughParticipants: "Δεν υπάρχουν αρκετοί συμμετέχοντες"
  },
  confirmDialog: { agree: "Οκ", disagree: "Ακυρωση" },
  pendingRequestsScreen: {
    requests: "Εκκρεμείς αιτήσεις",
    invites: "Εκκρεμείς προσκλήσεις",
    activities: "Εκκρεμείς δραστηριότητες",
    confirm: "ΕΠΙΒΕΒΑΙΩΣΗ",
    delete: "ΔΙΑΓΡΑΦΗ"
  },
  forgotPasswordScreen: {
    prompt:
      "Πληκτρολογήστε τη διεύθυνση ηλεκτρονικού ταχυδρομείου σας (το email) σας για να λάβετε έναν σύνδεσμο και να αλλάξετε τον κωδικό πρόσβασής σας",
    email: "Ηλεκτρονικό ταχυδρομείο",
    backNavTitle: "Ξεχάσα τον κωδικό",
    send: "ΑΠΟΣΤΟΛΗ",
    notExistErr: "Ο χρήστης δεν υπάρχει",
    err: "Κάτι πήγε στραβά",
    success: "Το μήνυμα ηλεκτρονικού ταχυδρομείου εστάλη",
    requiredErr: "Παρακαλούμε συμπληρώσετε αυτό το πεδίο."
  },
  changePasswordScreen: {
    prompt: "Παρακαλούμε εισαγάγετε τον νέο κωδικό πρόσβασής",
    password: "Κωδικός πρόσβασης",
    confirm: "Επιβεβαίωση κωδικού πρόσβασης",
    change: "ΑΛΛΑΓΗ",
    err: "Οι κωδικοί πρόσβασης δεν ταιριάζουν",
    badRequest: "Σφάλμα Πρόσβασης",
    requiredErr: "Παρακαλούμε συμπληρώστε αυτό το πεδίο.",
    typeMismatchErr: "Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση e-mail."
  },
  calendar: {
    userCalendar: "Το ημερολόγιο μου",
    groupCalendar: "Το ημερολόγιο της ομάδας"
  },
  framilyListItem: { delete: "" }
};

const hu = {
  participantsModal: {
    header: "Résztvevők",
    cancel: "Bezár"
  },
  managePlanSolution: {
    needsHeader: "SLOT SZÜKSÉGEK",
    selectFrom: "Válassza ki a elérhetőségeket a következőből",
    participating: "A részt vevő tagok tervezése",
    available: "rendelkezésre álló helyek tagjai",
    all: "Összes csoport tagja",
    automaticSuccess: "A tervet sikeresen átalakították tevékenységekké",
    manualSuccess: "Hamarosan e-mailben megkapja a terv végleges megoldását"
  },
  groupManagementScreen: {
    backNavTitle: "Csoportkezelés",
    totalVolunteers: "Önkéntesek összes száma",
    totalKids: "A gyerekek teljes száma",
    totalEvents: "Események összes száma",
    totalCompletedEvents: "A befejezett események összes száma",
    metricsHeader: "Csoportos mutatók",
    metricsColumn: "Metrika",
    rightsColumn: "Érték",
    chartHeader: "Felhasználónkénti összes hozzájárulás"
  },
  timeslotEmergencyScreen: {
    copy: "A segélyhívó szám másolása a vágólapra",
    call: "Hívás",
    header: "Sürgősségi számok:",
    services: {
      general: "Altalános vészhelyzet",
      ambulance: "Mentő",
      police: "Rendőrség",
      fire: "Tűzoltóság"
    }
  },
  editPlanScreen: {
    requiredErr: "Kérjük, töltse ki ezt a mezőt.",
    learning: "tanulási vagy oktatási tevékenységek / házi feladatok",
    nature: "természet",
    tourism: "turizmus és kultúra",
    hobby: "hobbi és sport",
    accompanying: "kísérő (autómegosztó vagy pedibusz)",
    entertainment: "szórakozás",
    parties: "partik vagy rendezvények",
    coplaying: "együttjátszó nap (ok)",
    other: "egyéb",
    category: "tevékenység típusa",
    backNavTitle: "Terv szerkesztése",
    ratio: "gyermekek és szülők aránya",
    minVolunteers: "Minimális önkéntesek",
    deadline: "határidő",
    needsState: "Igények biztosítása",
    availabilitiesState: "A rendelkezésre állás biztosítása",
    planningState: "Terv létrehozása",
    creationState: "Tevékenységek létrehozása",
    state: "terv állam",
    needsStateHelper:
      "A szükségleti szakaszban a felhasználók kiválasztják azokat a dátumokat, amelyekre szükségük lesz gyermekgondozásra. Ebben az állapotban a rendelkezésre állási szakasz zárolva van.",
    availabilitiesStateHelper:
      "A rendelkezésre állási fázisban a felhasználók kiválasztják azokat a dátumokat, amelyekben elérhetőek a gyermekgondozáshoz. Ebben az állapotban a szükséglet fázis zárolva van.",
    planningStateHelper:
      "A tervezési szakaszban a családok megosztási algoritmusa optimális tervet készít az adott igények és rendelkezésre állások alapján.",
    creationStateHelper:
      "A létrehozási szakaszban az optimális terv tevékenységekké alakul."
  },
  createPlanStepper: {
    name: "Név",
    from: "Tól",
    to: "To",
    description: "Leírás",
    location: "Hely",
    requiredErr: "Kérjük, töltse ki ezt a mezőt.",
    dateErr: "A határidőnek a megadott dátumtartomány előtt kell lennie",
    rangeErr: "Érvénytelen kezdési és befejezési dátum kombináció",
    continue: "Folytatás",
    cancel: "Cancel",
    finish: "Létrehozás",
    save: "Mentés",
    stepLabels: [
      "Adjon címet a tervezett tevékenységnek",
      "Állítsa be a tevékenység(ek) tervezett időszakát!",
      "Adjon meg egy határidőt, amíg visszajelezhetnek a csoporttagok!",
      "Adja meg a tevékenység tervezett helyszínét!"
    ]
  },
  managePlanScreen: {
    export: "Export terv",
    edit: "Terv szerkesztése",
    delete: "Terv törlése",
    exportConfirm: "Biztosan exportálni akarja ezt a tervet?",
    exportToaster:
      "A tervet xls formátumban exportálják. Ön rövid időn belül megkapja e-mailbenl",
    backNavTitle: "Tervezés kezelése",
    deleteConfirm: "Biztosan törli ezt a tervet?"
  },
  managePlanStepper: {
    amTimeslotFrom: "AM időtáblák tól",
    amTimeslotTo: "Ig",
    pmTimeslotFrom: "PM időtáblák tól",
    pmTimeslotTo: "Ig",
    create: "Létrehozás",
    discard: "megsemmisítés",
    zeroVolunteersTimeslots: "Időtáblák kezelése önkéntesek nélkül",
    activitiesCreation: "tevékenységek létrehozása",
    automatically: "Automatikusan",
    manually: "Kézzel",
    automaticSuccess: "A tervet sikeresen átalakították tevékenységekké",
    manualSuccess: "Hamarosan e-mailben megkapja a terv végleges megoldását",
    linkSuccess: "Hamarosan e-mailt fog kapni a megfelelő hivatkozással.",
    nextPhase: "Következő szakasz",
    previousPhase: "Előző szakasz",
    finishPlan: "Tevékenységek létrehozása",
    continue: "Folytatás",
    cancel: "Visszavonás",
    finish: "Küldés",
    link: "Fogadási link",
    desktopPrompt:
      "A biztosított megoldás szerkesztéséhez asztalra vagy laptopra kell férnie a platformon. Nyomja meg a gombot, hogy e-mailt kapjon a platform címével.",
    stepLabels: [
      "Új igények",
      "Igények testreszabása",
      "Hozzáférhetőség hozzáadása",
      "A rendelkezésre állás testreszabása",
      "Kezelje a megoldást",
      "Kezelje a tevékenységek részleteit"
    ],
    needsDeadline: "Addig kell teljesítenie igényeit",
    availabilitiesDeadline: "A rendelkezésre állását addig kell megadnia",
    availabilityError: "Hiányzik a dátum elérhetősége",
    needError: "Hiányzó gyermekmeghatalmazó dátumra",
    needsSuccess: "Sikeresen hozzáadta igényeit",
    availaibilitySuccess: "Sikeresen hozzáadta elérhetőségeit"
  },
  planListItem: {
    participantsNeeds: "a tagok meghatározták az igényeiket",
    participantNeeds: "a tagnak meghatározott igényei vannak",
    participantsAvailabilities: "a tagok meghatározták a elérhetőségeket",
    participantAvailabilities: "a tag megadta a elérhetőségeket",
    needsPhase: "Igények deklarálása",
    availabilitiesPhase: "elérhetőségek deklarálása",
    planningPhase: "Optimális megoldás keresése",
    creationPhase: "Terv átalakítása tevékenységekre"
  },
  communityInterface: {
    backNavTitle: "Közösségi felület",
    totalNumberOfUsers: "Összes felhasználó száma",
    totalNumberOfGroups: "Csoportok száma",
    averageAppRating: "App besorolás",
    averageNumberOfActivitiesPerGroup:
      "Csoportonkénti tevékenységek átlagos száma",
    averageNumberOfMembersPerGroup: "Csoportos tagok átlagos száma",
    totalNumberOfChildren: "Gyermekek száma",
    analyticsHeader: "Analytics",
    communityGrowth: "A platform felhasználói növekedése (%)",
    totalNumberOfGoogleSignups: "A Google-on regisztrált",
    totalNumberOfPlatformSignups: "Regisztrált a Families_Share platformon",
    timeslot_autoconfirm: "Időpont automatikus megerősítés",
    auto_admin: "Csoporttag automatikus admin",
    metricsColumn: "Metrikus",
    valuesColumn: "Érték",
    configurationsHeader: "Konfigurációk",
    chartsHeader: "Táblázatok",
    charts: [
      "A felhasználók száma",
      "A platformon regisztrált felhasználók száma",
      "A google-on regisztrált felhasználók száma",
      "Gyermekek száma",
      "Csoportok száma",
      "Csoporttagok átlagos száma",
      "A csoporttevékenységek átlagos száma"
    ]
  },
  profileChildren: {
    addChildPrompt:
      "Még nem adott meg gyermeket. Kattintson a gyermek ikonra új gyermek hozzáadásáért"
  },
  myCalendarScreen: {
    backNavTitle: "Eseménynaptáram"
  },
  editTimeslotScreen: {
    learning: "tanulási vagy oktatási tevékenységek / házi feladatok",
    nature: "természet",
    tourism: "turizmus és kultúra",
    hobby: "hobbi és sport",
    accopmanying: "kísérő (autómegosztó vagy pedibusz)",
    entertainment: "szórakozás",
    parties: "partik vagy rendezvények",
    coplaying: "együttjátszó nap (ok)",
    other: "egyéb",
    category: "tevékenység típusa",
    addTimeslotTitle: "Uj Időszak",
    from: "Tól",
    date: "Időpont",
    to: "Ig",
    details: "Részletek",
    parents: "Szülő hozzáadása szükséges",
    children: "Gyermek hozzáadása szükséges",
    name: "Cím",
    location: "Helyszín",
    description: "Leírás (opcionális)",
    cost: "Költségvonzat (opcionális)",
    status: "Időszak állapota",
    ongoing: "Folyamatban lévő",
    completed: "Befejezett",
    timeErr: "Érvénytelen a kezdő és a záró idöpont kombinációja",
    requiredErr: "Kérjük, töltse ki ezt a mezőt",
    rangeErr: "Kérjük, adjon meg nullánál nagyobb értéket",
    editConfirm: "Jóváhagyja a módosításokat?",
    crucialChangeConfirm:
      "Amennyiben elmenti ezeket a változtatásokat, akkor a teljes csoport leiratkozik. Jóváhagyja a módosításokat?",
    deleteConfirm: "Biztosan törölni szeretné ezt az időrést?"
  },
  timeslotScreen: {
    externals: "Külső",
    externalAvailabilities: "Adjon hozzá külső elérhetőségeket",
    externalPlaceholder: "Adjon hozzá egy külső önkéntes",
    allUsersAvailabilities: "Felhasználói elérhetőségek hozzáadása",
    allChildrenAvailabilities: "Gyerekek elérhetőségének hozzáadása",
    parentSubscribe1: "Hozzáadta",
    parentSubscribe2: "a tevékenységhez",
    parentUnsubscribe1: "Leiratkozott",
    parentUnsubscribe2: "a tevékenységről",
    phoneConfirm: "Hívás",
    copy: "A számot a vágólapra másolta",
    emergency: "Vészhelyzet",
    minimum: "minimum érték",
    userAvailability: "Adja meg saját elérhetőségét",
    childrenAvailability: "Adja meg gyermeke elérhetőségét",
    volunteer: "önkéntes",
    volunteers: "önkéntesek",
    child: "gyermek",
    children: "gyermekek",
    signup: "feliratkozott",
    userSubscribe: "Hozzáadta magát a tevékenységhez",
    userUnsubscribe: "Leiratkozott a tevékenységről",
    childSubscribe1: "Hozzáadta",
    childSubscribe2: "a tevékenységhez",
    childUnsubscribe1: "Leiratkozott",
    childUnsubscribe2: "a tevékenységről",
    childSubscribeConfirm1: "Biztosan hozzá szeretné adni",
    childSubscribeConfirm2: "a tevékenységhez",
    childUnsubscribeConfirm1: "Biztosan le szeretne jelentkezni",
    childUnsubscribeConfirm2: "a tevékenységről",
    editConfirm: "Jóváhagyja a módosításokat?",
    you: "Ön",
    userSubscribeConfirm:
      "Biztosan hozzá szeretné adni magát a tevékenységhez?",
    userUnsubscribeConfirm: "Biztosan le szeretne iratkozni a tevékenységről?"
  },
  timeslotPreview: {
    confirmed: "Jóváhagyva",
    pending: "Jóváhagyásra vár",
    participating: "Ön és gyermeke részt fognak venni",
    parentParticipating: "Ön részt fog venni",
    notParticipating: "Új feliratokhoz kapható"
  },
  ratingModal: {
    title: "Milyennek találja a Families_Share-t?",
    rate: "Értékelje",
    rateInstruction: "Hány csillagot adna nekünk egy 1-5-ig terjedő skálán?"
  },
  landingHeader: {
    communityName: null
  },
  landingNavbar: {
    logIn: "Bejelentkezés",
    signUp: "Regisztráció"
  },
  aboutScreen: {
    findOutMore: "További információért, kérjük látogasson el a honlapra",
    privacyPolicy: "Adatvédelmi Irányelvek",
    aboutHeader: "A projektről",
    familyShareSolution: "A Families_Share megoldás",
    firstParagraph:
      "Az Európai Bizottság Horizont 2020, az Unió ipari vezető szerepének erősítését célzó komponensének Információs és Kommunikációs technológiák prioritási tengelye finanszírozásával, célja olyan közösségi figyelemfelkeltő fenntarthatósági és társadalmi innovációs platform kialakítása, amely ösztönzi a gyermekfelügyelet és a munka-magánélet egyensúlyának fenntartását. A platform szomszédsági kapcsolatrendszerre épít, továbbá elősegíti a polgárok egymás közötti feladat-, idő- és gyermekneveléssel összefüggésbe hozható képességeinek, iskolán kívüli tevékenységeinek, szabadidejének megosztását - amelyek másként megfizethetetlenek lennének a gazdasági stagnálás, illetve visszaesés időszakaiban.",
    challengeHeader: "A kihívás",
    secondParagraph:
      "A munka-magánélet egyensúlyának fenntartása az elmúlt évtized egyik legnagyobb kihívásává vált. A legutóbbi gazdasági válság következtében jelentősen csökkent a teljes munkaidős álláshelyek száma (mindez különösen igaz a női munkakörök esetében) és elterjedtek a részmunkaidős, azonban sokszor egyenlőtlen munkaterhelést eredményező álláshelyek. Ennek következtében, a munkanélküliségi ráta folyamatos növekedésével párhuzamosan emelkedett a részmunkaidős álláshelyek száma. A stabil álláshelyek már nem tekinthetőek elterjedtnek, a határozatlan időre álláslehetőséget kínáló szerződések száma jelentősen megnőtt, a dolgozók többségének munkaerőpiaci átképzését és időszakos munkanélküliségét magával hozva. A határozott idejű munkaszerződések eredményeképpen megjelentek az egyenetlen munkaterheléssel és hosszabb munkaórákkal járó álláshelyek, a munka-magánélet egyensúlyát megnehezíve, a jelenlegi modelleket pedig fenntarthatatlanná téve. ",
    fourthParagraph:
      "A Families_Share projekt alulról szerveződő megoldást kínál a közösen kialakított platform segítségével elősegítve a családok gyermekfelügyelettel kapcsolatos idejének és feladatainak, a gyermeknevelési, oktatási órákon túli, szabadidős és háztartási feladatainak megosztására - különös tekintettel az alacsony jövedelmű családokra.A projekt emellett épít az idősebb generáció bevonására, gyermekfelügyeleti, bevásárlási és a családok életét érintő adminisztratív feladatokon keresztül. A fentiek érdekében, a projekt kihasználja az időbank megoldást, építve a partnerség meglévő digitális társadalmi innovációs tapasztalataira. Továbbá, felhasználja az információs és kommunikációs technológiai hálózatokban rejlő lehetőségeket az önszerveződő szomszédságok kialakításának elősegítésével.",
    europeanUnionText:
      "A projekt az Európai Unió Horizont 2020 programja keretében részesült finanszírozásban (Téma: ICT-11-2017 tevékenység típusa: innovációs tevékenység, támogatási szerződés száma: 780783)",
    backNavTitle: "Rólunk"
  },
  landingScreen: {
    suggestionsHeader: "A közösség csoportjai",
    cardHeader: "A projektről",
    cardInfo:
      "A Families_Share keretében közösségi és figyelemfelkeltő platform kerül kialakításra, amely célja a gyermekfelügyelet és a munka-magánélet egyensúlyának fenntartása."
  },
  logInScreen: {
    backNavTitle: "Bejelentkezés",
    forgotPassword: "Elfelejtett jelszó?",
    orLogInWith: "Jelentkezzen be másként",
    google: "Google",
    facebook: "Facebook",
    dontHaveAccount: "Még nincs fiókja?",
    signUp: "Bejelentkezés",
    agreeWithTerms:
      "Bejelentkezésével elfogadja a szolgáltatási feltételeket és adatvédelmi szabályzatot."
  },
  logInForm: {
    password: "Jelszó",
    email: "E-mail",
    confirm: "Erősítse meg",
    authenticationErr: "Érvénytelen e-mail cím vagy jelszó",
    requiredErr: "Kérjük, töltse ki ezt a mezőt",
    tooShortErr: "Kérjük, adjon meg legalább 8 karaktert",
    typeMismatchErr: "Kárjük, adjon meg e-mail címet"
  },
  signUpScreen: {
    backNavTitle: "Bejelentkezés",
    accountQuestion: "Van már felhasználói fiókja?",
    logIn: "Bejelentkezés"
  },
  signUpForm: {
    email: "E-mail",
    givenName: "Keresztnév",
    familyName: "Vezetéknév",
    password: "Jelszó",
    confirmPassword: "Erősítse meg jelszavát",
    confirm: "Erősítse meg",
    profileVisibility: "A profilom megjelenik a keresési találatok között",
    termsPolicy: "Feltételek és szabályzat",
    phoneNumber: "Telefonszám (opcionális)",
    confirmPasswordErr: "Eltérő jelszavak",
    signupErr: "Másik jelszó használatban",
    acceptTermsErr: "Kérjük, fogadja el a feltételeket és a szabályzatot",
    passwordPrompt: "A jelszónak legalább 8 karaktert kell tartalmaznia",
    requiredErr: "Kérjük, töltse ki ezt a mezőt",
    tooShortErr: "Kérjük, adjon meg legalább 8 karaktert",
    typeMismatchErr: "Kérjük, adjon meg e-mail címet",
    visibilityPrompt:
      "A felhasználók keresési találatai között megjelenik a profilon az applikációban"
  },
  privacyPolicyModal: {
    privacyPolicy: (
      <div>
        <h1>Families_Share Adatvédelmi Irányelvek</h1>
        <p>
          A jelen Adatvédelmi Irányelvek tájékoztatást adnak arról, hogy milyen
          adatokat gyűjtünk, miért gyűjtünk őket, illetve Ön hogyan frissítheti,
          kezelheti, exportálhatja és törölheti adatait.
        </p>
        <ol type="i">
          <li>
            <h2>Families_Share Adatvédelmi Irányelvek</h2>
            <p>
              Üdvözöljük a Families_Share weboldalán (az Oldalon). Az Oldal
              azért jött létre, hogy információkat nyújtson a Families_Share
              szolgáltatásairól. A Families_Share alkalmazás a weboldallal
              együtt képezi a Szolgáltatásokat a látogatók és a felhasználók
              számára (az Ön számára).
            </p>
            <p>
              Jelen Adatvédelmi Irányelvek kijelölik a Families_Share
              irányelveit az Ön adataira vonatkozóan, ide értve az Ön személyes
              beazonosításra alkalmas adatait („személyes adatok” az Európai
              Unió területén vagy „személyesen beazonosítható adatok” az
              Amerikai Egyesült Államok területén), valamint az egyéb, a
              Szolgáltatást igénybe vevő felhasználóktól és látogatóktól
              gyűjtött adatokat is. Kérjük, olvassa el figyelmesen az
              Adatvédelmi Irányelveket annak érdekében, hogy megismerje, hogyan
              kezeljük az adatait. Valamennyi Szolgáltatásunk igénybevételével
              Ön megerősíti, hogy elolvasta, megértette és elfogadta a jelen
              Adatvédelmi Irányelveket. Amennyiben nem fogadja el az Adatvédelmi
              Irányelveinket, kérjük, ne használja a Szolgáltatásainkat. Az
              Adatvédelmi Irányelvekkel kapcsolatban felmerülő kérdéseit,
              észrevételeit, kérjük, küldje el az{" "}
              <bold>contact@families-share.eu</bold> címre.
            </p>
          </li>
          <li>
            <h2>Kik vagyunk?</h2>
            <p>
              A ViLabs az Európai Uniós Families_Share Projekt honlapjának és a
              Families_Share alkalmazás fejlesztéséért és kezeléséért, valamint
              a kapcsolódó szolgáltatásokért Felelős Partnere, valamint a
              projekt Adatfeldolgozója és Adatkezelője.
            </p>
            <p>
              ViLabs CY („Versatile Innovations”), ECASTICA Business centre 6,
              Vasili Vryonides str. Gala Court Chambers, Limassol, Cyprus t. +30
              2310 365 188, +35 725 760 967, <bold>info@vilabs.eu</bold>. A
              továbbiakban úgy hivatkozunk rá, mint: „ViLabs”, „mi”, „minket”,
              „miénk”.
            </p>
          </li>
          <li>
            <h2>A jogállásunk és az alkalmazandó adatvédelmi jogszabályok</h2>
            <p>
              A ViLabs felelős az adatok feldolgozásáért és az adatok
              kezeléséért az EU mindenkor hatályos jogszabályainak megfelelően.
              A személyes adatok gyűjtése, felhasználása, tárolása és
              feldolgozása az Általános Adatvédelmi Rendelettel (Az Európai
              Parlament és a Tanács (EU) 2016/679 Rendelete – GDPR), valamint Az
              Európai Parlament és a Tanács 2002/58/Ek Irányelvével
              ("Elektronikus hírközlési adatvédelmi irányelv") teljes
              összhangban történik. Az adattárolókhoz kizárólag a ViLabs kutatói
              és rendszergazdái férhetnek hozzá. A Families_Share Szolgáltatásai
              az Európai Unión belül lévő, a contabo (https://contabo.com/)
              által biztosított szervereken tárolódnak.
            </p>
          </li>
          <li>
            <h2>Az általunk gyűjtött adatok köre</h2>
            <p>
              Amikor Ön kapcsolatba lép velünk a Szolgáltatásainkon keresztül,
              mi személyes adatokat és egyéb információkat gyűjtünk Öntől az
              alábbiakban részletezettek szerint: Személyes adatokat gyűjtünk
              Öntől azokban az esetekben, amikor Ön önkéntesen szolgáltat
              számunkra ilyen adatokat, például amikor megkeres minket
              valamilyen kérdésével, regisztrál a Szolgáltatásokhoz való
              hozzáférés érdekében, illetve egyes Szolgáltatások használatával.
            </p>
            <p>
              A Families_Share platform adatokat gyűjt különösen a szülőkről, a
              gyermekekről és a gyermekgondozói csoportokról gyűjt adatokat.
            </p>
            <ul>
              <li>
                <p>
                  &bull; A szülőkről gyűjtött adatok: családi és utónév,
                  telefonszám, lakcím, email cím és fotó/avatar.
                </p>
              </li>
              <li>
                <p>
                  &bull; A gyermekekről gyűjtött adatok: Adatokat kizárólag a
                  szülői felügyeleti jogot gyakorló szülőktől gyűjtünk, aki a
                  vonatkozó jogszabályoknak megfelelően jogosult a tárgyhoz
                  tartozó adatok biztosítására. A gyűjtött adatok köre: név,
                  születési idő, nem, fotó/avatar, valamint egyéb, a szülők
                  által közvetlen megadott adatok (allergiák, betegségek,
                  speciális étrend, speciális szükségletek, stb.).
                </p>
              </li>
              <li>
                <p>
                  &bull; A gyermekgondozói csoportokról gyűjtött adatok: a
                  csoport neve, a csoport leírása, a gyermekgondozás helyszíne,
                  ideje, valamint a csoportba feltöltött üzenetek tartalma
                  (szöveg és fényképek).
                </p>
              </li>
              <li>
                <p>
                  &bull; Technikai és egyéb adatokat gyűjtünk bármely eszközről,
                  amelyen keresztül igénybe veszi Szolgáltatásainkat, beleértve
                  az eszköze egyedi eszközazonosítóját (UDID) vagy az azzal
                  egyenértékű azonosítót; az operációs rendszere, a böngészője
                  és más szoftverei típusáról; a hardvere vagy a mobil eszköze
                  részleteiről (ide értve a mobil eszköze típusát és számát,
                  illetve a mobil hordozóeszköze részleteit), amennyiben azok
                  értelmezhetők; és egyéb technikai részletekről.
                </p>
              </li>
              <li>
                <p>
                  &bull; A Szolgáltatások használatának részletei: mérhető
                  adatokat gyűjtünk arról, hogy mikor és hogy használja a
                  Szolgáltatásainkat.
                </p>
              </li>
            </ul>
            <p>
              A személyes adatai önkéntes szolgáltatásával hozzájárul ahhoz,
              hogy azokat a Szolgáltatásainkkal összefüggésben felhasználjuk a
              jelen Adatvédelmi Irányelvekkel összhangban (GDPR 6. cikk (1)
              bekezdés a) pontja). A személyes adatok feldolgozásának szintén
              minden esetben jogszerűen kell történnie, amennyiben az szükséges
              a Szolgáltatások működéséhez (GDPR 6. cikk (1) bekezdés b)
              pontja). A személyes adatok különleges kategóriára vonatkozóan
              vegye figyelembe, hogy az ilyen adatoknak a Szolgáltatások
              céljaihoz történő megadásával Ön kifejezett beleegyezését adja
              nekünk azok feldolgozására is.
            </p>
          </li>
          <li>
            <h2>A személyes adatainak és egyéb információk használata</h2>
            <p>
              Az általunk gyűjtött adatok azonnal elkülönítésre kerülnek (i) egy
              részre, amely személyes (de nem érzékeny) adatokat tartalmaz (úgy
              mint név, email cím, telefonszám, stb.) az érintettekről, valamint
              (ii) egy másik, teljesen anonimizált (személyes
              beazonosíthatóságra alkalmatlan) részre, amely a későbbiek során a
              teljes konzorcium számára elérhetővé válik kutatási célokra.
            </p>
            <p>
              Az egyes CityLabek résztvevőinek személyes adatai az alkalmazáson
              keresztül megosztásra kerülnek a csoport többi tagjával is a
              Families_Share tevékenységek szervezése érdekében, a csoport
              adminisztrátorának felügyelete alatt. A csoporttagok által
              tanúsított bármilyen jellegű visszaélés az érintett felhasználó
              fiókjának törlését vonja maga után. Kérjük, vegye figyelembe, hogy
              az egyes csoportokhoz való csatlakozás lehetősége a csoport
              adminisztrátorának jóváhagyásától függ.
            </p>
            <p>
              A résztvevőktől egyéb személyes adatokat csak indokolt esetben és
              kizárólag tudományos céllal gyűjtünk (például longitudinális
              vizsgálatok esetén a későbbi kapcsolatfelvétel érdekében), és
              azokat projekt befejezésével egyidőben azonnal megsemmisítjük. Az
              anonimizált adatok egy megosztott tárhelyen kerülnek megőrzésre,
              amelyek a projekt befejezése után az elkészült tanulmányok és
              publikációk igazolására maradnak fenn. A Szolgáltatások
              felhasználhatnak ilyen információkat és anonimizált és
              generalizált módon összeköthetik azokat nyomon követés céljából,
              például a Szolgáltatások felhasználóinak számának összesítéséhez,
              a honlap egyes oldalai látogatottságának méréséhez, valamint a
              látogatók internetszolgáltatói domain nevének követéséhez (ebben
              az esetben személyes adatok nem kerülnek gyűjtésre).
            </p>
          </li>
          <li>
            <h2>A személyes adatok és egyéb információk közzététele</h2>
            <p>
              A Families_Share (és így a felelős partner, a ViLabs) kizárólag
              abban az esetben teszi közzé az Ön adatait, ha arra törvényi vagy
              egyéb kötelezettsége van, valamint jóhiszeműség hitében, kizárólag
              olyan esetben, ha ez feltétlen szükséges:
            </p>
            <ul>
              <li>
                <p>
                  &bull; valamilyen jogszabályi kötelezettségnek való
                  megfeleléshez;
                </p>
              </li>
              <li>
                <p>
                  &bull; a Szolgáltatások felhasználóinak személyes védelme vagy
                  a nyilvánosság védelme érdekében sürgős és előre nem látható
                  körülmények között; vagy
                </p>
              </li>
              <li>
                <p> &bull; a jogi felelősség védelmében. </p>
              </li>
            </ul>
          </li>
          <li>
            <h2>Az Ön lehetőségei</h2>
            <p>
              Dönthet úgy, hogy a személyes adatai megadása nélkül veszi igénybe
              Szolgáltatásainkat. Amennyiben a személyes adatai szolgáltatásának
              megtagadása mellett dönt, előfordulhat, hogy a Families_Share
              bizonyos Szolgáltatásait nem fogja tudni használni.
            </p>
          </li>
          <li>
            <h2>Adatgyűjtés</h2>
            <p>
              Minden általunk gyűjtött adat a Families_Share platformra
              regisztrált felhasználóktól származik. Legtöbbször a szülőknek
              hozzájárulásukat kell adniuk a gyermekeik személyes és érzékeny
              adatainak kezeléséhez. Így tehát a gyermekek adatait a szülők
              szolgáltatják, az adatgyűjtés pedig az Általános Adatvédelmi
              Rendeletnek (8. cikk) megfelelően történik:
            </p>
            <ul>
              <li>
                <p>
                  &bull; Ha a 6. cikk (1) bekezdésének a) pontja alkalmazandó, a
                  közvetlenül gyermekeknek kínált, információs társadalommal
                  összefüggő szolgáltatások vonatkozásában végzett személyes
                  adatok kezelése akkor jogszerű, ha a gyermek a 16. életévét
                  betöltötte. A 16. életévét be nem töltött gyermek esetén, a
                  gyermekek személyes adatainak kezelése csak akkor és olyan
                  mértékben jogszerű, ha a hozzájárulást a gyermek feletti
                  szülői felügyeletet gyakorló adta meg, illetve engedélyezte.
                </p>
              </li>
              <li>
                <p>
                  &bull;Az adatkezelő – figyelembe véve az elérhető technológiát
                  – észszerű erőfeszítéseket tesz, hogy ilyen esetekben
                  ellenőrizze, hogy a hozzájárulást a gyermek feletti szülői
                  felügyeleti jog gyakorlója adta meg, illetve engedélyezte.
                </p>
              </li>
              <li>
                <p>
                  &bull; Az (1) bekezdés nem érinti a tagállamok általános
                  szerződési jogát, például a gyermek által kötött szerződések
                  érvényességére, formájára vagy hatályára vonatkozó
                  szabályokat.”
                </p>
              </li>
            </ul>
            <p>
              Ugyanitt hívjuk fel a figyelmet az Általános Adatvédelmi Rendelet
              32. pontjára: „Az adatkezelésre csak akkor kerülhet sor, ha az
              érintett egyértelmű megerősítő cselekedettel, például írásbeli –
              ideértve az elektronikus úton tett –, vagy szóbeli nyilatkozattal
              önkéntes, konkrét, tájékoztatáson alapuló és egyértelmű
              hozzájárulását adja a természetes személyt érintő személyes adatok
              kezeléséhez. Ilyen hozzájárulásnak minősül az is, ha az érintett
              valamely internetes honlap megtekintése során bejelöl egy erre
              vonatkozó négyzetet, az információs társadalommal összefüggő
              szolgáltatások igénybevétele során erre vonatkozó technikai
              beállításokat hajt végre, valamint bármely egyéb olyan nyilatkozat
              vagy cselekedet is, amely az adott összefüggésben az érintett
              hozzájárulását személyes adatainak tervezett kezeléséhez
              egyértelműen jelzi. […] Ha az érintett hozzájárulását elektronikus
              felkérést követően adja meg, a felkérésnek egyértelműnek és
              tömörnek kell lennie, és az nem gátolhatja szükségtelenül azon
              szolgáltatás igénybevételét, amely vonatkozásában a hozzájárulást
              kérik.”
            </p>
          </li>
          <li>
            <h2>Gyermekek</h2>
            <p>
              A Families_Share tudatosan nem gyűjt személyes adatokat 16 év
              alatti gyermekektől. Kérjük, amennyiben még nem töltötte be a 16.
              életévét, semmilyen személyes adatot ne adjon meg a
              Szolgáltatásainkon keresztül. Arra biztatjuk a szülőket és a
              törvényes képviselőket, hogy felügyeljék gyermekeik
              internethasználati szokásait, és segítsék érvényesíteni az
              Adatvédelmi Irányelveinket azáltal, hogy arra tanítják őket, hogy
              soha ne szolgáltassák ki a személyes adataikat az ő kifejezett
              engedélyük nélkül. Amennyiben tudomása van róla, hogy egy 16 év
              alatti gyermek személyes adatokat szolgáltatott a Families_Share
              számára a Szolgáltatásainkon keresztül, kérjük, lépjen kapcsolatba
              velünk, és mindent megteszünk annak érdekében, hogy az érintett
              adatok törlésre kerüljenek az adatbázisunkból.
            </p>
          </li>
          <li>
            <h2>Adattárolás és megőrzési stratégia</h2>
            <p>
              A Families_Share minden Szolgáltatása egy felhő alapú rendszeren
              keresztül biztosított, és a platform backend és frontend része,
              valamint minden adat biztonságos és védett, kifejezetten erre a
              célra használt szervereken tárolódik egy hitelesített, felhő alapú
              tárhely-szolgáltatón keresztül, amely rendelkezik az Általános
              Adatvédelmi Rendeletben előírt minden szükséges infrastruktúrával
              és tanúsítvánnyal.
            </p>
            <p>
              A felhő alapú szolgáltatás szolgáltatójáról a ViLabs felelős
              megbízottja, valamint egy kinevezett adatvédelmi tisztviselő
              intézkedik (a projekt koordinátora, Prof. Agostino Cortesi,
              Universita Ca’Foscari Venezia, <bold>cortesi@unive.it)</bold>, az
              elérhető jó gyakorlatokat és legjobb minőségi sztenderdeket
              követve.
            </p>
            <p>
              A személyes adatok a Families_Share EU által támogatott Horizon
              2020 Projekt hivatalos élettartamának idejére (2020.10.31.-ig)
              kerülnek megőrzésre és tárolásra. A projekt hivatalos befejezése
              után azon felhasználók személyes adatai, akik több mint egy éve
              (365 napja) nem jelentkeztek be a felhasználói fiókjukkal, teljes
              mértékben törlésre kerülnek.
            </p>
            <p>
              A felhő alapú szolgáltató védett tárhelye redundáns rendszereken
              alapul és az Európai Unión belül található. Az adatról naponta
              biztonsági másolatok készülnek, amely másolatokat szintén az EU-n
              belül található adatközpontokban tárolnak el.
            </p>
            <p>
              A tárhelyen tárolt adatokhoz való hozzáférés felhasználónév és
              jelszó megadásával történő hitelesítéshez kötött, a folyamat az
              Európai Parlament és a Tanács 2002/58/Ek Irányelvével összhangban
              történik.
            </p>
            <p>
              Kizárólag a ViLabs kutatói (kutatási céllal) és rendszergazdái
              (kezelési és karbantartási céllal) férnek hozzá az adattárolóhoz.
            </p>
          </li>
          <li>
            <h2>Adatok harmadik félnek való kiszolgáltatása</h2>
            <p>
              Semmilyen személyes adatot nem adunk át harmadik félnek. Az adatok
              kizárólag a platformon belül kerülnek felhasználásra a fent
              leírtaknak megfelelően (V.). s
            </p>
            <p>
              Az alkalmazás nem él rejtett „szándékok” használatával. Ez megvédi
              az adatokat az ugyanazon eszközön futó más alkalmazások általi
              jogszerűtlen hozzáféréstől.
            </p>
          </li>
          <li>
            <h2>Biztonság</h2>
            <p>
              A ViLabs ésszerű lépéseket tesz annak érdekében, hogy megóvja a
              Szolgáltatásainkon keresztül megadott személyes adatokat a
              véletlen elvesztéssel, a visszaélésekkel, az illetéktelen
              hozzáféréssel, közzététellel, megváltoztatással vagy
              megsemmisítéssel szemben. Az adatok felhasználók és tárhely
              közötti kommunikációja titkosított, SSL-alapú protokollon
              keresztül zajlik.
            </p>
            <p>
              Az Ön felelőssége, hogy megfelelően védje eszközét a jogosulatlan
              hozzáféréssel szemben, amelyre az alkalmazást telepíti.
            </p>
            <p>
              A regisztrált Families_Share felhasználók felhasználónévvel és egy
              egyedi azonosítóval rendelkeznek, amely lehetővé teszi a
              Szolgáltatások adott részeihez való hozzáférést. Az Ön
              felelőssége, hogy ezeket az adatokat bizalmasan kezelje, és ne
              adja át harmadik félnek.
            </p>
          </li>
          <li>
            <h2>Az Ön jogai – A felhasználói fiókjának törlése</h2>
            <p>
              Az EU adatvédelmi szabályozása minden EU polgár részére jogot
              biztosít ahhoz, hogy hozzáférjen az adatokhoz, amelyeket róla
              tárolnak. Valamennyi Önről szóló információt lehetősége van
              szerkeszteni a Szolgáltatásainkon keresztül az Általános
              Adatvédelmi Rendeletnek (15.-22. cikk) megfelelően. Továbbá, joga
              van az adatok helyesbítéséhez, az adatkezelés alapját jelentő
              hozzájárulásának visszavonásához, az Önről szóló adatok törléséhez
              („az elfeledtetéshez való jog”), az adatkezelés korlátozásához, az
              adathordozhatósághoz, a tiltakozáshoz a személyes adatainak
              kezelése ellen, valamint jogosult lehet arra, hogy ne terjedjen ki
              Önre a kizárólag automatizált adatkezelésen –ideértve a
              profilalkotást is– alapuló döntés hatálya. Joga van panaszt tenni
              egy felügyeleti hatóságnál, és joga van ahhoz, hogy hatékony
              bírósági jogorvoslattal éljen.
            </p>
            <p>
              Bármikor felkereshet minket emailen keresztül:
              <bold>contact@families-share.eu</bold>
            </p>
            <p>
              Minden felhasználónak lehetősége van megváltoztatni a róla szóló
              személyes információkat. A felhasználók hozzáférnek és letölthetik
              a róluk tárolt információk másolatát, valamint a különböző
              tevékenységekben való részvételükről szóló információkat a
              Families_Share alkalmazáson keresztül. A felhasználóknak joga van
              a felhasználói fiókjuk, valamint az ahhoz kapcsolódó információk
              teljes törléséhez.
            </p>
            <p>
              A fiók felhasználó általi törlése után az anonimizált adatok
              kivételével a lehető legrövidebb időn belül kötelesek vagyunk
              megsemmisíteni minden személyes adatot, mivel a további
              adatkezelés jogalapja megszűnik.
            </p>
            <p>
              Lehetősége van emailben kérelmezni, hogy töröljük személyes
              adatait az adatbázisunkból. Ezt bármikor megteheti az
              <bold>contact@families-share.eu</bold> címen keresztül.
            </p>
          </li>
          <li>
            <h2>Az Adatvédelmi Irányelvek változásai</h2>
            <p>
              Előfordulhat, hogy jelen Adatvédelmi Irányelveink időnként
              megváltoznak. Amennyiben változásra kerül sor, úgy a változásoknak
              megfelelően megváltozik az új irányelvek hatálybalépésének napja
              is. Az új Adatvédelmi Irányelvek online közzétételre kerülnek, míg
              az érintett felek erről külön értesítést is kapnak.
            </p>
          </li>
          <li>
            <h2>Kommunikáció</h2>
            <p>
              Velünk kapcsolatos további információk elérése érdekében, kérjük,
              látogassa meg honlapunkat: https://www.families-share.eu/
            </p>
            <p>
              A Families_Share Adatvédelmi Irányelveivel, vagy az adatkezelési
              gyakorlatunkkal kapcsolatban felmerülő kérdéseit, észrevételeit
              örömmel fogadjuk emailen keresztül, a következő elérhetőségen:
              contact@families-share.eu
            </p>
          </li>
          <li>
            <h2>Adatkezelés</h2>
            <p>
              Adatvédelmi tiszt: Prof.Agostino Cortesi, Universita Ca’Foscari
              Venezia,<bold>cortesi@unive.it</bold>
            </p>
            <p>
              A platform adatgazdája: Apostolos Vontas, ViLabs Director,{" "}
              <bold>avontas@vilabs.eu</bold>
            </p>
            <p>
              Adatkezelő: Apostolos Vontas, ViLabs Director,
              <bold>avontas@vilabs.eu</bold>
            </p>
          </li>
        </ol>
        <p>
          Az Elfogad gombra kattintva igazolom, hogy elolvastam és megértettem
          és elfogadja a fenti adatvédelmi irányelveket
        </p>
      </div>
    ),
    accept: "ELFOGAD"
  },
  groupAbout: {
    header: "A csoportról",
    memberHeader: "Rólunk"
  },
  groupActivities: {
    exportConfirm: "Biztosan exportálni akarja a csoport napirendjét?",
    activitiesHeader: "A csoport tevékenységei",
    plansHeader: "Függőben lévő tervek",
    export: "Program exportálása",
    newPlan: "Speciális tervezés",
    newActivity: "Új tevékenység"
  },
  activityListItem: {
    every: "Mindegyik",
    of: "Mindegyik"
  },
  groupListItem: {
    open: "A csoportban történő részvétel bárki számára lehetséges",
    closed: "A csoportban történő részvétel csak tagok számára lehetséges",
    members: "Tagok",
    kids: "Gyermekek"
  },
  groupInfo: {
    contactMessage: "Az információ másolása a vágólapra",
    contact: "KOZLES",
    startGuideHeader: "Segítségre van szüksége a kezdéshez?",
    startGuideInfo: "Nézze meg 7 lépéses útmutatónkat!",
    join: "Csatlakozás",
    leave: "Kilépés",
    pending: "Igénylés visszavonása",
    confirm: "Biztosan ki szeretne lépni a csoportból?"
  },
  groupNavbar: {
    chatTab: "Üzenetek",
    activitiesTab: "Tevékenységek",
    membersTab: "Tagok",
    infoTab: "A csoportról",
    calendarTab: "Eseménynaptáram"
  },
  groupMembersAdminOptions: {
    invite: "Emberek meghívása",
    groupIsOpen: "Nyitott csoport",
    groupIsClosed: "Zárt csoport",
    requestsOpen: "Csatlakozás lehetséges",
    requestsClosed: "A csoport betelt "
  },
  inviteModal: {
    memberHeader: "Emberek meghívása",
    parentHeader: "Szülő hozzáadása",
    framilyHeader: "Család hozzáadása",
    invite: "Meghívás",
    add: "Hozzáadás",
    cancel: "Visszavonás",
    search: "Keresés"
  },
  groupNewsNavbar: {
    parents: "SZÜLŐK",
    children: "GYERMEKEK"
  },
  cardWithLink: {
    learnMore: "További információ"
  },
  memberContact: {
    administrator: "Adminisztrátor",
    addAdmin: "Adminisztrátor hozzáadása",
    removeAdmin: "Adminisztrátor eltávolítása",
    removeUser: "Felhasználó eltávolítása"
  },
  startUpGuide: {
    backNavTitle: "Kezdő felhasználóknak szóló útmutató",
    guide: [
      {
        main:
          "Hírdesse meg a kezdeményezést barátai, ismerősei, munkatársai, szomszédai körében",
        secondary: null
      },
      {
        main: "Kapcsolja össze az érdeklődőket egy csoportban",
        secondary: null
      },
      {
        main: "Határozza meg a programok helyszínét",
        secondary: null
      },
      {
        main: "Egyeztessen a csoporttagokkal a részletekről",
        secondary: null
      },
      {
        main: "Véglegesítse a programot",
        secondary: null
      },
      {
        main: "Tegye közzé a tevékenységet!",
        secondary: null
      },
      {
        main: "Indulhat a program, jó szórakozást!",
        secondary: null
      }
    ]
  },
  notificationScreen: {
    backNavTitle: "Értesítés"
  },
  myFamiliesShareHeader: {
    confirmDialogTitle: "Küldjünk Önnek egy bemutató anyagot e-mail címére?",
    walkthrough: "Útmutató a használathoz",
    rating: "Értékeljen minket!",
    header: "Saját Families_Share-m",
    homeButton: "Főoldal",
    myProfile: "Profilom",
    myCalendar: "Eseménynaptáram",
    createGroup: "Csoport létrehozása",
    searchGroup: "Csoport keresése",
    inviteFriends: "Barátok meghívása",
    faqs: "GYIK",
    about: "Rólunk",
    signOut: "Kijelentkezés",
    language: "Nyelv",
    export: "Adatok exportálása",
    community: "Közösség"
  },
  myFamiliesShareScreen: {
    myGroups: "Csoportjaim",
    myActivities: "Tevékenységeim",
    myNotifications: "Értesítéseim",
    myGroupsPrompt:
      "Még nincs csoportja, használja az alábbi menüt a csoport megtalálására",
    myActivitiesPrompt:
      "Itt láthatja a jövőbeli tevékenységeit miután feiratkozott egy vagy több csoportba",
    joinPrompt: "CSAPATHOZ CSATLAKOZNI",
    createPrompt: "CSOPORT LETREHOZASA"
  },
  faqsScreen: {
    backNavTitle: "GYIK"
  },
  searchGroupModal: {
    search: "Csoport keresése",
    example: "Pl. iskolai órák utáni tevékenységek",
    results: "Eredmények"
  },
  createGroup: {
    backNavTitle: "Csoport létrehozása"
  },
  createGroupStepper: {
    contactTypes: {
      phone: "Telefon",
      none: " - ",
      email: "E-mail"
    },
    contactInfo: "Kérjük, töltse ki elérhetőségét",
    continue: "Folytatás",
    cancel: "Visszavonás",
    finish: "Befejezés",
    stepLabels: [
      "Adjon meg címet és leírást",
      "Adja meg a láthatóságra vonatkozó beállításokat",
      "Adja meg a területet",
      "Adjon meg elérhetőségi adatokat",
      "Emberek meghívása"
    ],
    name: "Név",
    description: "Leírás",
    visibleGroup: "Mások keresési találatai között megjelenik a csoportom",
    invisibleGroup:
      "Mások keresési találatai között nem jelenik meg a csoportom",
    area: "Terület",
    invite: "Csoporttag hozzáadása",
    nameErr: "Csoport megnevezése már foglalt",
    requiredErr: "Kérjük, töltse ki ezt a mezőt"
  },
  profileNavbar: {
    framily: "Család",
    info: "Információ",
    children: "Gyermekek"
  },
  profileInfo: {
    description: "Leírás",
    adress: "Cím",
    email: "Személyes",
    mobile: "Mobil telefonszám",
    home: "Vezetékes telefonszám",
    unspecified: "További információ nem elérhető"
  },
  profileScreen: {
    privateProfile: "Magán profil"
  },
  editProfileScreen: {
    whatsappOption: "WhatsApp",
    viberOption: "Viber",
    emailOption: "Email",
    description: "Adjon meg választható leírást",
    save: "Mentés",
    header: "Profil szerkesztése",
    name: "Név",
    surname: "Vezetéknév",
    phoneNumber: "Telefonszám",
    phoneLabel: "Címke",
    street: "Utca",
    streetNumber: "Házszám",
    country: "Ország",
    city: "Város",
    email: "E-mail cím",
    mobile: "Mobil telefonszám",
    home: "Vezetékes telefonszám",
    unspecified: "További információ nem elérhető",
    visible: "Nyilvános profil",
    invisible: "Láthatatlan profil",
    cityErr: "Nem létező város",
    requiredErr: "Kérjük, töltse ki ezt a mezőt"
  },
  editGroupScreen: {
    phone: "Telefon",
    none: " - ",
    email: "E-mail",
    save: "Mentés",
    header: "Csoport szerkesztése",
    name: "Név",
    description: "Leírás",
    file: "Feltöltés",
    area: "Terület",
    nameErr: "Foglalt csoport megnevezés",
    visible: "Nyilvános csoport",
    invisible: "Láthatatlan csoport",
    requiredErr: "Kérjük, töltse ki ezt a mezőt"
  },
  profileHeader: {
    export: "exportálás",
    delete: "törlés",
    signout: "Kijelentkezés",
    deleteDialogTitle: "Biztosan törölni szeretné profilját és összes adatát?",
    exportDialogTitle: "Biztosan exportálni szeretné személyes adatait?",
    suspend: "Felfüggesztve",
    suspendDialogTitle: "Biztosan szeretné időlegesen felfüggeszteni fiókját?",
    suspendSuccess:
      "Fiókját átmenetileg felfüggesztettük. A következő bejelentkezés alkalmával fiókja aktiválásra kerül.",
    exportSuccess: "Hamarosan e-mailt fog kapni az összes személyes adatról",
    error: "Hiba történt"
  },
  replyBar: {
    new: "Új üzenet",
    maxFilesError: "Legfeljebb 3 file tölthető fel"
  },
  announcementReplies: {
    new: "Véleménye"
  },
  reply: {
    confirmDialogTitle: "Biztosan törölni szeretné válaszát?"
  },
  groupHeader: {
    confirmDialogTitle: "Biztosan törölni szeretné a csoportot?"
  },
  announcementHeader: {
    confirmDialogTitle: "Biztosan törölni szeretné ezt?"
  },
  childListItem: {
    boy: "Fiú",
    girl: "Lány",
    age: "Éves"
  },
  childProfileHeader: {
    delete: "Gyermek törlése",
    confirmDialogTitle:
      "Biztosan törölni szeretné a gyermeket és valamennyi adatát?"
  },
  childProfileInfo: {
    boy: "Fiú",
    girl: "Lány",
    unspecified: "Meghatározhatatlan",
    age: "éves",
    additional: "további információ",
    allergies: "Allergiák",
    otherInfo: "Egyéb információ",
    specialNeeds: "Sajátos nevelési igény",
    addAdditional: "Hozzáadás",
    addParent: "Szülő hozzáadása",
    confirmDialogTitle: "Biztosan törölni szeretné ezt a szülőt?"
  },
  editChildProfileScreen: {
    backNavTitle: "Profil szerkesztése",
    save: "Mentés",
    name: "Név",
    surname: "Vezéknév",
    birthday: "Születésnap",
    gender: "Nem",
    additional: "Speciális információ hozzáadása",
    example: "pl. étel intolerancia",
    boy: "Fiú",
    girl: "Lány",
    date: "Nap",
    add: "Szerkesztés",
    month: "Hónap",
    year: "Év",
    file: "File kiválasztása",
    unspecified: "Meghatározhatatlan",
    requiredErrr: "Kérjük, töltse ki ezt a mezőt"
  },
  createChildScreen: {
    backNavTitle: "Gyermek hozzáadása",
    save: "Mentés",
    name: "Név",
    surname: "Vezetéknév",
    birthday: "Születésnap",
    gender: "Nem",
    additional: "Speciális információ hozzáadása",
    add: "Hozzáadás",
    edit: "Szerkesztés",
    example: "pl. étel intolerancia",
    boy: "Fiú",
    girl: "Lány",
    date: "Nap",
    month: "Hónap",
    year: "Év",
    acceptTerms:
      "Hozzájárulok a felhaszálási feltételekhez és személyes adataim kezeléséhez",
    acceptTermsErr: "Kérjük, fogadja el a felhasználási feltételeket",
    unspecified: "Meghatározhatatlan",
    requiredErr: "Kérjük, töltse ki ezt a mezőt"
  },
  additionalInfoScreen: {
    backNavTitle: "Információ",
    save: "Mentés",
    allergy: "Allergia",
    special: "Sajátos nevelési igény",
    others: "Egyéb",
    acceptTerms:
      "Tudomásul veszem, hogy ez az információ megosztásra kerül a gyermekfelügyeleti tevékenységekben részt vevő más csoporttagokkal."
  },
  createActivityScreen: {
    backNavTitle: "Új tevékenység"
  },
  createPlanScreen: { backNavTitle: "Új terv" },
  createActivityStepper: {
    pendingMessage: "A tevékenység a rendszergazda megerősítésétől függ",
    continue: "Folytatás",
    cancel: "Visszavonás",
    finish: "Létrehozás",
    save: "Mentés",
    stepLabels: ["Információ", "Dátumok", "Időpontok"]
  },
  createActivityInformation: {
    color: "Színezze be a tevékenységet",
    description: "Leírás (opcionális)",
    name: "Nevezze meg a tevékenységet",
    location: "Helyszín (opcionális)"
  },
  createActivityDates: {
    header: "Jelöljön meg egy vagy több napot",
    repetition: "Ismétlés",
    weekly: "Heti",
    monthly: "Havi ",
    datesError: "Több kiválasztott nap esetén ismétlés nem lehetséges"
  },
  createActivityTimeslots: {
    header: "Adjon hozzá időpontokat a kiválasztott napokhoz",
    differentTimeslots: "Naponta különböző időpontok?",
    sameTimeslots: "Ugyanazon időpontok minden nap?",
    selected: "dátumok kiválasztása"
  },
  timeslotsContainer: {
    addTimeslot: "Időpont hozzáadása",
    timeslot: "Időpont",
    timeslots: "Időpontok",
    confirmDialogTitle: "Biztosan törölni szeretné ezt az időpontot?",
    timeRangeError: "Érvénytelen kezdő és záró idöpont kombinációja"
  },
  clockModal: {
    am: "Délelőtt",
    pm: "Délután",
    start: "Tegye közzé a tevékenységet! / Kezdés",
    end: "Szerkesztés",
    confirm: "OK",
    cancel: "Visszavonás"
  },
  activityScreen: {
    volunteers: "Onkéntesek",
    children: "Gyermekek",
    pdfToaster:
      "A tevékenységet pdf formátumban exportálják. Hamarosan megkapja e-mailben.",
    excelToaster:
      "A tevékenységet exportálják excel formátumban. Hamarosan megkapja e-mailben.",
    color: "Szín",
    deleteDialogTitle: "Biztosan törölni szeretné ezt a tevékenységet?",
    exportDialogTitle: "Biztosan exportálni szeretné ezt a tevékenységet?",
    delete: "Törlés",
    exportPdf: "Exportálás Pdf",
    exportExcel: "Exportálás Excel",
    every: "Mindegyik",
    of: "Mindegyik",
    infoHeader: "Tevékenységre vonatkozó információ"
  },
  timeslotsList: {
    fixed: "Rögzítve",
    completed: "Befejezve",
    timeslot: "Időpont",
    timeslots: "Időpontok",
    available: "elérhető",
    all: "Minden időpont",
    mySigned: "Feliratkozásaim",
    myChildrenSigned: "Gyerekeim előfizetései",
    enough: "Résztvevők száma elegendő",
    notEnough: "Résztvevők száma nem elengedő"
  },
  filterTimeslotsDrawer: {
    header: "Időpontok szűrése",
    all: "Minden időpont",
    mySigned: "Feliratkozásaim",
    myChildrenSigned: "Gyerekeim előfizetései",
    enough: "Résztvevők száma elegendő",
    notEnough: "Résztvevők száma nem elengedő"
  },
  expandedTimeslot: {
    signup: "Feliratkozás",
    parents: "Szülők feliratkozása sikeres",
    children: "Gyermekek feliratkozása sikeres",
    parent: "Szülő feliratkozása sikeres",
    child: "Gyermek feliratkozása sikeres",
    fixed: "Rögzítve",
    completed: "Befejezve"
  },
  expandedTimeslotEdit: {
    details: "Részletek",
    from: "tól ",
    to: "ig",
    parents: "A tevékenységhez szükséges szülők száma",
    children: "A tevékenységhez szükséges gyermekek száma",
    footer: null,
    name:
      "A változtatások csak az időszakot érintik és nem vonatkoznak a tevékenységre",
    location: "Helyszín",
    description: "Leírás (opcionális)",
    cost: "Költségvonzat (opcionális)",
    status: "Időszakok állapota",
    fixed: "Rögzítve",
    completed: "Befejezve",
    timeErr: "Érvénytelen a kezdő és a záró idöpont kombinációja",
    requiredErr: "Kérjük, töltse ki ezt a mezőt",
    rangeErr: "Kérjük, adjon meg null",
    learning: "tanulási vagy oktatási tevékenységek / házi feladatok",
    nature: "természet",
    tourism: "turizmus és kultúra",
    hobby: "hobbi és sport",
    accopmanying: "kísérő (autómegosztó vagy pedibusz)",
    entertainment: "szórakozás",
    parties: "partik vagy rendezvények",
    coplaying: "együttjátszó nap (ok)",
    other: "egyéb",
    category: "tevékenység típusa"
  },
  editActivityScreen: {
    backNavTitle: "Tevékenység szerkesztése",
    color: "Színezze be a tevékenységet",
    description: "Leírás (opcionális)",
    name: "Tevékenység megnevezése",
    save: "Mentés",
    location: "Helyszín (opcionális)"
  },
  agendaView: {
    timeslots: "időpontok",
    available: "elérhető",
    all: "Minden időpont",
    signed: "Feliratkozásaim",
    enough: "Résztvevők száma elegendő",
    notEnough: "Résztvevők száma nem elengedő",
    notEnoughParticipants: "Résztvevők száma nem éri el a minimális létszámot"
  },
  confirmDialog: {
    agree: "OK",
    disagree: "Visszavonás"
  },
  pendingRequestsScreen: {
    requests: "Függőben lévő felkérés ",
    invites: "Függőben lévő meghívás",
    activities: "Függőben lévő tevékenység",
    confirm: "Megerősítés",
    delete: "Törlés"
  },
  forgotPasswordScreen: {
    prompt:
      "Kérjük, adja meg e-mail címét a jelszó megváltoztatását tartalamzó link elküldésére",
    email: "E-mail",
    backNavTitle: "Elfelejtett jelszó",
    send: "Küldés",
    notExistErr: "Nem létező felhasználó",
    err: "Hiba történt",
    success: "E-mail elküldve",
    requiredErrr: "Kérjük, töltse ki ezt a mezőt"
  },
  changePasswordScreen: {
    prompt: "Kérjük, adjon meg új jelszót",
    password: "Jelszó",
    confirm: "Jelszó megerősítése",
    change: "Változtatás",
    err: "Nem egyező jelszavak",
    badRequest: "Hibás igény",
    requiredErr: "Kérjük, töltse ki ezt a mezőt",
    tooShortErr: "Kérjük, adjon meg legalább 8 karaktert"
  },
  calendar: {
    userCalendar: "Eseménynaptáram",
    groupCalendar: "Csoportos eseménynaptár"
  },
  framilyListItem: {
    delete: "Család törlése"
  }
};

const texts = { en, el, it, hu, nl };

export default texts;
