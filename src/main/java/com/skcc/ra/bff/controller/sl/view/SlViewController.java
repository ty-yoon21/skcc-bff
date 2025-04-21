package com.skcc.ra.bff.controller.sl.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "sl/view")
public class SlViewController {

    @GetMapping("/sl-vendor-reg")
    public String getSlVendorReg(HttpServletRequest request, Model model) {
        return "sl/slVendorReg";
    }

    @GetMapping("/sl-info-reg")
    public String getSlInfoReg(HttpServletRequest request, Model model) {
        return "sl/slInfoReg";
    }

    @GetMapping("/sl-process")
    public String getSlProcess(HttpServletRequest request, Model model) {
        return "sl/slProcess";
    }

    @GetMapping("/sl-slip-proc")
    public String getSlSlipProc(HttpServletRequest request, Model model) {
        return "sl/slSlipProc";
    }

    @GetMapping("/sl-proc-status")
    public String getSlProcStatus(HttpServletRequest request, Model model) {
        return "sl/slProcStatus";
    }
} 