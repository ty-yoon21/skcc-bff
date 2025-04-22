package com.skcc.ra.bff.controller.facility.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "facility/view")
public class facilityViewController {

    @GetMapping("/facilityRoomStatus")
    public String viewFacilityroomstatus(HttpServletRequest request, Model model) {
        return "facility/facilityRoomStatus";
    }

    @GetMapping("/facilityUsageProcedure")
    public String viewFacilityusageprocedure(HttpServletRequest request, Model model) {
        return "facility/facilityUsageProcedure";
    }

    @GetMapping("/facilityUsageFee")
    public String viewFacilityusagefee(HttpServletRequest request, Model model) {
        return "facility/facilityUsageFee";
    }

    @GetMapping("/facilityRentalRequest")
    public String viewFacilityrentalrequest(HttpServletRequest request, Model model) {
        return "facility/facilityRentalRequest";
    }

    @GetMapping("/facilityReservationStatus")
    public String viewFacilityreservationstatus(HttpServletRequest request, Model model) {
        return "facility/facilityReservationStatus";
    }

    @GetMapping("/facilityUsageGuide")
    public String viewFacilityusageguide(HttpServletRequest request, Model model) {
        return "facility/facilityUsageGuide";
    }
} 