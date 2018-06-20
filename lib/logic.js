/**
 * A Graduate grants access to their record to Business.
 * @param {org.degree.ucsd.AuthorizeAccess} authorize - the authorize to be processed
 * @transaction
 */
function authorizeAccess(authorize) {

    var me = getCurrentParticipant();
    console.log('**** AUTH: ' + me.getIdentifier() + ' granting access to ' + authorize.businessRut);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the business is not already authorized, we authorize them
    var index = -1;

    if (!me.authorized) {
        me.authorized = [];
    }
    else {
        index = me.authorized.indexOf(authorize.businessRut);
    }

    if (index < 0) {
        me.authorized.push(authorize.businessRut);

        return getParticipantRegistry('org.degree.ucsd.Graduate')
            .then(function (graduateRegistry) {

                // emit an event
                var event = getFactory().newEvent('org.degree.ucsd', 'GraduateEvent');
                event.graduateTransaction = authorize;
                emit(event);

                // persist the state of the graduate
                return graduateRegistry.update(me);
            });
    }
}

/**
 * A Graduate revokes access to their record from a Business.
 * @param {org.degree.ucsd.RevokeAccess} revoke - the RevokeAccess to be processed
 * @transaction
 */
function revokeAccess(revoke) {

    var me = getCurrentParticipant();
    console.log('**** REVOKE: ' + me.getIdentifier() + ' revoking access to ' + revoke.businessRut);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the business is authorized, we remove them
    var index = me.authorized ? me.authorized.indexOf(revoke.businessRut) : -1;

    if (index > -1) {
        me.authorized.splice(index, 1);

        return getParticipantRegistry('org.degree.ucsd.Graduate')
            .then(function (graduateRegistry) {

                // emit an event
                var event = getFactory().newEvent('org.degree.ucsd', 'GraduateEvent');
                event.graduateTransaction = revoke;
                emit(event);

                // persist the state of the graduate
                return graduateRegistry.update(me);
            });
    }
}

/**
 * A Graduate grants access to their Degree assets
 * @param {org.degree.ucsd.AuthorizeDegreeAccess} transaction - authorize transaction
 * @transaction
 */
async function AuthorizeDegreeAccess(transaction) {
    var me = getCurrentParticipant();

    if (me == null) {
        throw new Error("A participant/certificate mapping does not exist");
    }

    var requestorId = transaction.businessRut;
    if (requestorId == null) {
        throw new Error("Invalid request. \"businessRut\" should be defined");
    }

    var myId = me.getIdentifier();
    console.log("Business " + myId + " grants \"Degree\" access to " + requestorId);

    return query("getDegreeByGraduateRut", { graduateRut: myId })
        .then(function (records) {
            if (records.length > 0) {
                var serializer = getSerializer();
                var degree = serializer.toJSON(records[0]);

                if (!Array.isArray(degree.authorized)) {
                    degree.authorized = [];
                }

                if (degree.authorized.indexOf(requestorId) < 0) {
                    degree.authorized.push(requestorId);

                    return getAssetRegistry("org.degree.ucsd.Degree")
                        .then(function (registry) { registry.update(serializer.fromJSON(degree)) })
                        .then(function () {
                            var event = getFactory().newEvent('org.degree.ucsd', 'DegreeEvent');
                            event.degreeTransaction = transaction;
                            emit(event);
                        });
                }
            }
        })
        .catch(function (ex) { console.error(ex); throw ex; });
}

/**
 * A Graduate revokes access to their Degree assets
 * @param {org.degree.ucsd.RevokeDegreeAccess} transaction - revoke transaction
 * @transaction
 */
function revokeDegreeAccess(transaction) {
    var me = getCurrentParticipant();

    if (me == null) {
        throw new Error("A participant/certificate mapping does not exist");
    }

    var requestorId = transaction.businessRut;
    if (requestorId == null) {
        throw new Error("Invalid request. \"businessRut\" should be defined");
    }

    var myId = me.getIdentifier();
    console.log("graduateRut " + myId + " grants \"Degree\" access to " + requestorId);

    return query("getDegreeByGraduateRut", { graduateRut: myId })
        .then(function (records) {
            if (records.length > 0) {
                var serializer = getSerializer();
                var degree = serializer.toJSON(records[0]);

                if (Array.isArray(degree.authorized)) {
                    var index = degree.authorized.indexOf(requestorId);

                    if (index >= 0) {
                        degree.authorized.splice(index, 1);

                        return getAssetRegistry("org.degree.ucsd.Degree")
                            .then(function (registry) { registry.update(serializer.fromJSON(degree)) })
                            .then(function () {
                                var event = getFactory().newEvent('org.degree.ucsd', 'DegreeEvent');
                                event.degreeTransaction = transaction;
                                emit(event);
                            });
                    }
                }
            }
        })
        .catch(function (ex) { console.error(ex); throw ex; });
}