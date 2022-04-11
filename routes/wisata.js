var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET wisata page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM wisata",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("wisata/list", {
          title: "wisata",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var wisata = {
        id: req.params.id,
      };

      var delete_sql = "delete from wisata where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          wisata,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/wisata");
            } else {
              req.flash("msg_info", "Delete wisata Success");
              res.redirect("/wisata");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM wisata where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/wisata");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data can't be find!");
              res.redirect("/wisata");
            } else {
              console.log(rows);
              res.render("wisata/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_alamat = req.sanitize("alamat").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_waktu = req.sanitize("waktu").escape();

      var wisata = {
        nama: v_nama,
        alamat: v_alamat,
        harga: v_harga,
        waktu: v_waktu,
      };

      var update_sql = "update wisata SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          wisata,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("wisata/edit", {
                nama: req.param("nama"),
                alamat: req.param("alamat"),
                harga: req.param("harga"),
                waktu: req.param("waktu"),
              });
            } else {
              req.flash("msg_info", "Update wisata success");
              res.redirect("/wisata/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/wisata/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the nama").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_alamat = req.sanitize("alamat").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_waktu = req.sanitize("waktu").escape();

    var wisata = {
      nama: v_nama,
      alamat: v_alamat,
      harga: v_harga,
      waktu: v_waktu,
    };

    var insert_sql = "INSERT INTO wisata SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        wisata,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("wisata/add-wisata", {
              nama: req.param("nama"),
              alamat: req.param("alamat"),
              harga: req.param("harga"),
              waktu: req.param("waktu"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create wisata success");
            res.redirect("/wisata");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("wisata/add", {
      nama: req.param("nama"),
      alamat: req.param("alamat"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("wisata/add", {
    title: "Add New wisata",
    nama: "",
    alamat: "",
    harga: "",
    waktu: "",
    session_store: req.session,
  });
});

module.exports = router;
