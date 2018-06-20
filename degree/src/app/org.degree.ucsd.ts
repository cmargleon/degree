import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.degree.ucsd{
   export class Address {
      street: string;
      house: string;
      city: string;
      county: string;
      country: string;
      zip: string;
   }
   export class Member extends Participant {
      email: string;
      firstName: string;
      lastName: string;
      dob: Date;
      address: Address;
      authorized: string[];
   }
   export abstract class MemberTransaction extends Transaction {
      memberId: string;
      member: Member;
   }
   export class AuthorizeAccess extends MemberTransaction {
   }
   export class RevokeAccess extends MemberTransaction {
   }
   export abstract class DegreeTransaction extends Transaction {
      memberId: string;
   }
   export class AuthorizeDegreeAccess extends DegreeTransaction {
      degreeIds: string[];
   }
   export class RevokeDegreeAccess extends DegreeTransaction {
      degreeIds: string[];
   }
   export class Degree extends Asset {
      degreeId: string;
      memberId: string;
      Owner: string;
      DegreeType: string;
      DegreeStatus: string;
      Major: string;
      Major2: string;
      Minor: string;
      Minor2: string;
      gpa: string;
      StartYear: string;
      GradYear: string;
      authorized: string[];
   }
   export class MemberEvent extends Event {
      memberTransaction: MemberTransaction;
   }
   export class DegreeEvent extends Event {
      degreeTransaction: DegreeTransaction;
   }
// }
