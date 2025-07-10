// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string name;
        string description;
        uint goal;
        uint durationInDays;
        uint amountCollected;
        uint startTime;
        bool completed;
    }

    Campaign[] public campaigns;
    mapping(uint => address[]) public donators;
    mapping(uint => uint[]) public donations;

    event CampaignCreated(uint campaignId, address indexed owner);
    event DonationReceived(uint indexed campaignId, address indexed donator, uint amount);
    event FundsWithdrawn(uint indexed campaignId, address indexed recipient, uint amount);

    /// @notice Create a new campaign
    function createCampaign(
        string memory _name,
        string memory _description,
        uint _goal,
        uint _durationInDays
    ) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");

        Campaign memory newCampaign = Campaign({
            owner: msg.sender,
            name: _name,
            description: _description,
            goal: _goal,
            durationInDays: _durationInDays,
            amountCollected: 0,
            startTime: block.timestamp,
            completed: false
        });

        campaigns.push(newCampaign);
        emit CampaignCreated(campaigns.length - 1, msg.sender);
    }

    /// @notice Donate to a specific campaign
    function donateToCampaign(uint256 _id) public payable {
        require(_id < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];

        require(
            block.timestamp <= campaign.startTime + (campaign.durationInDays * 1 days),
            "Campaign has ended."
        );
        require(msg.value > 0, "Donation must be greater than 0");

        donators[_id].push(msg.sender);
        donations[_id].push(msg.value);

        campaign.amountCollected += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    event DebugWithdraw(address to, uint amount, uint contractBalanceBefore, uint contractBalanceAfter);

function withdrawFunds(uint _pId) public {
    require(_pId < campaigns.length, "Invalid campaign ID");
    Campaign storage campaign = campaigns[_pId];

    require(msg.sender == campaign.owner, "Not the campaign owner");
    require(!campaign.completed, "Campaign already completed");
    require(campaign.amountCollected >= campaign.goal, "Goal not reached");

    uint balance = campaign.amountCollected;
    uint before = address(this).balance;

    campaign.amountCollected = 0;
    campaign.completed = true;

    (bool sent, ) = payable(campaign.owner).call{value: balance}("");
    require(sent, "Failed to send Ether");

    uint afterBal = address(this).balance;

    emit DebugWithdraw(campaign.owner, balance, before, afterBal);
    emit FundsWithdrawn(_pId, campaign.owner, balance);
}

    /// @notice View all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    /// @notice View campaigns created by a specific user
    function getUserCampaigns(address _user) public view returns (Campaign[] memory) {
        uint count = 0;
        for (uint i = 0; i < campaigns.length; i++) {
            if (campaigns[i].owner == _user) {
                count++;
            }
        }

        Campaign[] memory result = new Campaign[](count);
        uint index = 0;
        for (uint i = 0; i < campaigns.length; i++) {
            if (campaigns[i].owner == _user) {
                result[index] = campaigns[i];
                index++;
            }
        }
        return result;
    }

    /// @notice Get all donators and donations for a campaign
    function getDonations(uint _pId) public view returns (address[] memory, uint[] memory) {
        return (donators[_pId], donations[_pId]);
    }

    /// @notice Check contract balance (for testing/debugging only)
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
