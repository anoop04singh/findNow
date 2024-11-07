# FindNow: A Blockchain-based Organ Tracking Platform

## About the Project
FindNow is a decentralized platform designed to help hospitals track and manage available organs across different institutions. By leveraging blockchain technology, FindNow ensures transparency and efficiency in the process of organ donation and distribution, making it easier for hospitals to find organs they need and contribute to the overall organ donation ecosystem.

## Contract Address
The smart contract for the FindNow platform is deployed on the Sepolia Ethereum network. You can interact with it using the contract address:

**Contract Address**: `0x90D72514a1dd3E7061566a3aecCa64FB4d94c07B`

## Contract Functions

### Hospital Management Functions

- **addHospital(address hospitalAddress, string memory name, string memory location, string memory contactInfo)**:  
  Allows the owner to register a new hospital with details like name, location, and contact information. The hospital is linked to its address and can list available organs.

- **removeHospital(address hospitalAddress)**:  
  Allows the owner to remove a hospital from the system, which deletes the hospital's data from the contract.

### Organ Management Functions

- **addOrgan(string memory organName, string memory organDetails)**:  
  Hospitals can list available organs for donation by providing details like the organ's name and description. This adds the organ to the contract's registry.

- **getAllAvailableOrgans()**:  
  This function returns a list of all available organs that can be donated. The organs that are not currently requested are included in this list.

- **getAllDeliveredOrgans()**:  
  Returns a list of all organs that have been successfully delivered to the requesting hospitals.

- **getAllRequestedOrgans()**:  
  Returns a list of organs that have been requested by hospitals but not yet delivered.

- **getAllConfirmedOrgans()**:  
  This function returns a list of organs whose request has been confirmed by the donor hospital.

### Request and Confirmation Functions

- **requestOrgan(uint organId)**:  
  Allows a hospital to request an organ by its ID. Once requested, the organ is marked as unavailable.

- **confirmOrganRequest(uint organId)**:  
  Allows the donor hospital to confirm the request of a specific organ. This confirms the transfer process.

- **markOrganAsReceived(uint organId)**:  
  Once the organ is received by the requesting hospital, this function is used to mark the organ as delivered and update the organ statistics. The donating hospital’s organ count is updated, and the organ is removed from the registry.

## Contract Details

- **Owner**: The contract owner (typically the administrator) has special rights to manage hospitals.
  
- **Hospital Structure**: Each hospital has a name, location, contact information, and tracks the number of organs listed and donated.

- **Organ Structure**: Each organ listed has an ID, associated hospital, details, availability status, and whether it has been requested, confirmed, and delivered.

## Usage

1. **Adding a Hospital**:  
   The contract owner can register hospitals using the `addHospital` function. Hospitals must have a valid address, name, location, and contact info.

2. **Listing Organs**:  
   Hospitals can list available organs using the `addOrgan` function. Once listed, the organ is available for other hospitals to request.

3. **Requesting an Organ**:  
   A hospital that requires a specific organ can request it using the `requestOrgan` function. The requested organ is marked as unavailable until the donation process is confirmed.

4. **Confirming a Request**:  
   The donor hospital can confirm the organ request using the `confirmOrganRequest` function. This starts the process of transferring the organ to the requesting hospital.

5. **Marking as Received**:  
   When the organ reaches its destination, the receiving hospital uses the `markOrganAsReceived` function to finalize the process and update the hospital’s donation and listing statistics.

## Future Scope

- **Integration with IoT Devices**:  
  Future enhancements could involve integrating IoT sensors to track the status and condition of organs during transit, providing real-time data to hospitals.

- **Global Network Expansion**:  
  As the platform grows, it could include hospitals globally, creating a more extensive organ donation network and improving the efficiency of organ matching and distribution.

- **Decentralized Medical Records**:  
  The system could evolve into a broader medical records system that tracks not only organ donation but also patient health, making it an all-encompassing tool for hospitals.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
