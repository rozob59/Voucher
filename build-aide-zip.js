import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const baseDir = '/tmp/aide_project/ROZOB_WiFi_Voucher_Manager';

// Ensure directories
fs.mkdirSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/data'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/utils'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'app/src/main/res/layout'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'app/src/main/res/values'), { recursive: true });

// 1. Root build.gradle
fs.writeFileSync(path.join(baseDir, 'build.gradle'), `// Top-level build file for AIDE Android Project
buildscript {
    ext.kotlin_version = '1.8.0'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`);

// 2. settings.gradle
fs.writeFileSync(path.join(baseDir, 'settings.gradle'), `include ':app'
rootProject.name = "ROZOB WiFi Voucher Manager"`);

// 3. app/build.gradle
fs.writeFileSync(path.join(baseDir, 'app/build.gradle'), `apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-kapt'

android {
    compileSdkVersion 33

    defaultConfig {
        applicationId "com.rozob.wifivouchermanager"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    implementation 'androidx.core:core-ktx:1.9.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.8.0'

    // Room Database
    implementation "androidx.room:room-runtime:2.5.0"
    implementation "androidx.room:room-ktx:2.5.0"
    kapt "androidx.room:room-compiler:2.5.0"

    // Gson
    implementation 'com.google.code.gson:gson:2.10.1'
}`);

// 4. AndroidManifest.xml
fs.writeFileSync(path.join(baseDir, 'app/src/main/AndroidManifest.xml'), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.rozob.wifivouchermanager">

    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@android:drawable/ic_dialog_info"
        android:label="@string/app_name"
        android:roundIcon="@android:drawable/ic_dialog_info"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.DayNight.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>
</manifest>`);

// 5. file_paths.xml
fs.mkdirSync(path.join(baseDir, 'app/src/main/res/xml'), { recursive: true });
fs.writeFileSync(path.join(baseDir, 'app/src/main/res/xml/file_paths.xml'), `<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-path name="external_files" path="." />
</paths>`);

// 6. Voucher.kt
fs.writeFileSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/data/Voucher.kt'), `package com.rozob.wifivouchermanager.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "vouchers")
data class Voucher(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val voucherCode: String,
    val packageName: String,
    val price: Double,
    val validityDays: Int,
    var status: String = "AVAILABLE", // AVAILABLE, USED
    var userName: String? = null,
    var userMobile: String? = null,
    var createdAt: Long = System.currentTimeMillis()
)`);

// 7. VoucherDao.kt
fs.writeFileSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/data/VoucherDao.kt'), `package com.rozob.wifivouchermanager.data

import androidx.lifecycle.LiveData
import androidx.room.*

@Dao
interface VoucherDao {
    @Query("SELECT * FROM vouchers ORDER BY id DESC")
    fun getAllVouchers(): LiveData<List<Voucher>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertVouchers(vouchers: List<Voucher>): List<Long>

    @Update
    fun updateVoucher(voucher: Voucher)

    @Query("DELETE FROM vouchers WHERE id = :id")
    fun softDelete(id: Long)
}`);

// 8. AppDatabase.kt
fs.writeFileSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/data/AppDatabase.kt'), `package com.rozob.wifivouchermanager.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Voucher::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun voucherDao(): VoucherDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "rozob_wifi_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`);

// 9. PdfGenerator.kt
fs.writeFileSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/utils/PdfGenerator.kt'), `package com.rozob.wifivouchermanager.utils

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.os.Environment
import com.rozob.wifivouchermanager.data.Voucher
import java.io.File
import java.io.FileOutputStream

object PdfGenerator {
    fun generateSingleVoucherPdf(context: Context, voucher: Voucher): File {
        val document = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(300, 450, 1).create()
        val page = document.startPage(pageInfo)
        val canvas: Canvas = page.canvas

        val paint = Paint().apply {
            color = Color.BLACK
            textSize = 14f
            isAntiAlias = true
        }

        val borderPaint = Paint().apply {
            color = Color.DKGRAY
            style = Paint.Style.STROKE
            strokeWidth = 3f
        }

        canvas.drawRect(10f, 10f, 290f, 440f, borderPaint)

        paint.textSize = 18f
        paint.color = Color.parseColor("#059669")
        canvas.drawText("ROZOB WiFi Voucher", 30f, 50f, paint)

        paint.textSize = 14f
        paint.color = Color.BLACK
        canvas.drawText("Code: " + voucher.voucherCode, 30f, 100f, paint)
        canvas.drawText("Package: " + voucher.packageName, 30f, 140f, paint)
        canvas.drawText("Price: BDT " + voucher.price.toInt(), 30f, 180f, paint)
        canvas.drawText("Validity: " + voucher.validityDays + " Days", 30f, 220f, paint)

        document.finishPage(page)

        val pdfDir = File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "ROZOB_Vouchers")
        if (!pdfDir.exists()) pdfDir.mkdirs()

        val file = File(pdfDir, "Voucher_" + voucher.voucherCode + ".pdf")
        FileOutputStream(file).use { out ->
            document.writeTo(out)
        }
        document.close()
        return file
    }
}`);

// 10. MainActivity.kt
fs.writeFileSync(path.join(baseDir, 'app/src/main/java/com/rozob/wifivouchermanager/MainActivity.kt'), `package com.rozob.wifivouchermanager

import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import com.rozob.wifivouchermanager.data.AppDatabase
import com.rozob.wifivouchermanager.data.Voucher
import com.rozob.wifivouchermanager.utils.PdfGenerator
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private lateinit var db: AppDatabase
    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    private lateinit var tvTotalCount: TextView
    private lateinit var tvAvailableCount: TextView
    private lateinit var etVoucherInput: EditText
    private lateinit var btnImport: Button
    private lateinit var btnExportPdf: Button
    private lateinit var etSearch: EditText
    private lateinit var lvVouchers: ListView

    private var allVouchers: List<Voucher> = ArrayList()
    private var displayedVouchers: MutableList<Voucher> = ArrayList()
    private lateinit var adapter: VoucherAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        try {
            setContentView(R.layout.main)
        } catch (e: Exception) {
            setContentView(R.layout.activity_main)
        }

        db = AppDatabase.getDatabase(this)
        initViews()
        setupListeners()
        loadDataFromDatabase()
    }

    private fun initViews() {
        tvTotalCount = findViewById(R.id.tvTotalCount)
        tvAvailableCount = findViewById(R.id.tvAvailableCount)
        etVoucherInput = findViewById(R.id.etVoucherInput)
        btnImport = findViewById(R.id.btnImport)
        btnExportPdf = findViewById(R.id.btnExportPdf)
        etSearch = findViewById(R.id.etSearch)
        lvVouchers = findViewById(R.id.lvVouchers)

        adapter = VoucherAdapter(this, displayedVouchers)
        lvVouchers.adapter = adapter
    }

    private fun setupListeners() {
        btnImport.setOnClickListener {
            val text = etVoucherInput.text.toString().trim()
            if (text.isEmpty()) {
                Toast.makeText(this, "অনুগ্রহ করে ভাউচার কোড পেস্ট করুন", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val lines = text.split("\\n").map { it.trim() }.filter { it.isNotEmpty() }
            if (lines.isEmpty()) {
                Toast.makeText(this, "কোনো বৈধ ভাউচার কোড পাওয়া যায়নি", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            executor.execute {
                val newVouchers = lines.map { code ->
                    Voucher(
                        voucherCode = code,
                        packageName = "1GB Daily",
                        price = 30.0,
                        validityDays = 1,
                        status = "AVAILABLE"
                    )
                }

                db.voucherDao().insertVouchers(newVouchers)

                mainHandler.post {
                    etVoucherInput.text.clear()
                    Toast.makeText(this, "\${lines.size} টি ভাউচার সফলভাবে ইমপোর্ট হয়েছে!", Toast.LENGTH_LONG).show()
                    loadDataFromDatabase()
                }
            }
        }

        etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterVouchers(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        lvVouchers.onItemClickListener = AdapterView.OnItemClickListener { _, _, position, _ ->
            if (position in 0 until displayedVouchers.size) {
                val v = displayedVouchers[position]
                copyVoucherToClipboard(v)
            }
        }

        lvVouchers.onItemLongClickListener = AdapterView.OnItemLongClickListener { _, _, position, _ ->
            if (position in 0 until displayedVouchers.size) {
                val v = displayedVouchers[position]
                showVoucherOptionsDialog(v)
            }
            true
        }

        btnExportPdf.setOnClickListener {
            if (displayedVouchers.isEmpty()) {
                Toast.makeText(this, "PDF প্রিন্ট করার মতো কোনো ভাউচার নেই", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            try {
                val firstVoucher = displayedVouchers[0]
                val pdfFile = PdfGenerator.generateSingleVoucherPdf(this, firstVoucher)
                
                val uri: Uri = try {
                    FileProvider.getUriForFile(this, "$packageName.provider", pdfFile)
                } catch (e: Exception) {
                    Uri.fromFile(pdfFile)
                }

                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "application/pdf")
                    flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NO_HISTORY
                }
                startActivity(Intent.createChooser(intent, "PDF ফাইল দেখুন/শেয়ার করুন"))
            } catch (e: Exception) {
                Toast.makeText(this, "PDF তৈরিতে সমস্যা হয়েছে: \${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadDataFromDatabase() {
        db.voucherDao().getAllVouchers().observe(this) { vouchers ->
            allVouchers = vouchers ?: ArrayList()
            filterVouchers(etSearch.text.toString())
            updateCounts()
        }
    }

    private fun updateCounts() {
        val total = allVouchers.size
        val avail = allVouchers.count { it.status == "AVAILABLE" }
        tvTotalCount.text = total.toString()
        tvAvailableCount.text = avail.toString()
    }

    private fun filterVouchers(query: String) {
        displayedVouchers.clear()
        if (query.isBlank()) {
            displayedVouchers.addAll(allVouchers)
        } else {
            val q = query.lowercase()
            for (v in allVouchers) {
                if (v.voucherCode.lowercase().contains(q) || (v.userName != null && v.userName!!.lowercase().contains(q))) {
                    displayedVouchers.add(v)
                }
            }
        }
        adapter.notifyDataSetChanged()
    }

    private showVoucherOptionsDialog(voucher: Voucher) {
        val options = arrayOf("শেয়ার করুন (Share)", "ব্যবহারকৃত চিহ্নিত করুন (Mark Used)", "মুছে ফেলুন (Delete)")
        AlertDialog.Builder(this)
            .setTitle("ভাউচার কোড: \${voucher.voucherCode}")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> shareVoucher(voucher)
                    1 -> toggleStatus(voucher)
                    2 -> deleteVoucher(voucher)
                }
            }
            .setNegativeButton("বাতিল", null)
            .show()
    }

    private fun toggleStatus(voucher: Voucher) {
        executor.execute {
            voucher.status = if (voucher.status == "AVAILABLE") "USED" else "AVAILABLE"
            db.voucherDao().updateVoucher(voucher)
            mainHandler.post {
                Toast.makeText(this, "স্ট্যাটাস আপডেট করা হয়েছে", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun deleteVoucher(voucher: Voucher) {
        executor.execute {
            db.voucherDao().softDelete(voucher.id)
            mainHandler.post {
                Toast.makeText(this, "ভাউচার মুছে ফেলা হয়েছে", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun copyVoucherToClipboard(voucher: Voucher) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val text = "ROZOB WiFi\\n\\nVoucher: \${voucher.voucherCode}\\nPackage: \${voucher.packageName}\\nPrice: ৳\${voucher.price.toInt()}\\nValidity: \${voucher.validityDays} Days\\nStatus: \${voucher.status}"
        val clip = ClipData.newPlainText("Voucher Info", text)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "ভাউচার কপি করা হয়েছে: \${voucher.voucherCode}", Toast.LENGTH_SHORT).show()
    }

    fun shareVoucher(voucher: Voucher) {
        val text = "ROZOB WiFi Voucher: \${voucher.voucherCode} | Package: \${voucher.packageName} | Price: ৳\${voucher.price.toInt()}"
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, text)
            type = "text/plain"
        }
        startActivity(Intent.createChooser(sendIntent, "ভাউচার শেয়ার করুন"))
    }

    private class VoucherAdapter(
        private val context: Context,
        private val list: List<Voucher>
    ) : BaseAdapter() {

        override fun getCount(): Int = list.size
        override fun getItem(position: Int): Any = list[position]
        override fun getItemId(position: Int): Long = list[position].id

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(context).inflate(
                try { R.layout.item_voucher } catch(e: Exception) { android.R.layout.simple_list_item_2 },
                parent,
                false
            )

            val voucher = list[position]
            val tvCode = view.findViewById<TextView>(R.id.tvCode)
            val tvStatus = view.findViewById<TextView>(R.id.tvStatus)
            val tvDetails = view.findViewById<TextView>(R.id.tvDetails)

            if (tvCode != null) tvCode.text = voucher.voucherCode
            if (tvStatus != null) {
                tvStatus.text = voucher.status
                tvStatus.setTextColor(if (voucher.status == "AVAILABLE") 0xFF34D399.toInt() else 0xFFF43F5E.toInt())
            }
            if (tvDetails != null) {
                tvDetails.text = "\${voucher.packageName} • ৳\${voucher.price.toInt()} • \${voucher.validityDays} দিন মেয়াদী"
            }

            return view
        }
    }
}`);

// 11. main.xml
fs.writeFileSync(path.join(baseDir, 'app/src/main/res/layout/main.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0F172A">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:background="#1E293B"
        android:padding="16dp"
        android:gravity="center_vertical">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="ROZOB WiFi Voucher Manager"
                android:textColor="#34D399"
                android:textSize="18sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="অফলাইন ওয়াইফাই ভাউচার ম্যানেজমেন্ট"
                android:textColor="#94A3B8"
                android:textSize="11sp" />
        </LinearLayout>

        <Button
            android:id="@+id/btnExportPdf"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="📄 PDF"
            android:textSize="12sp"
            android:background="#059669"
            android:textColor="#FFFFFF" />
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="12dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:weightSum="2"
                android:layout_marginBottom="8dp">

                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:background="#1E293B"
                    android:padding="12dp"
                    android:orientation="vertical"
                    android:layout_marginRight="4dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="মোট ভাউচার"
                        android:textColor="#94A3B8"
                        android:textSize="11sp" />

                    <TextView
                        android:id="@+id/tvTotalCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textColor="#38BDF8"
                        android:textSize="22sp"
                        android:textStyle="bold" />
                </LinearLayout>

                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:background="#1E293B"
                    android:padding="12dp"
                    android:orientation="vertical"
                    android:layout_marginLeft="4dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="অ্যাভেলেবল (Available)"
                        android:textColor="#94A3B8"
                        android:textSize="11sp" />

                    <TextView
                        android:id="@+id/tvAvailableCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="0"
                        android:textColor="#34D399"
                        android:textSize="22sp"
                        android:textStyle="bold" />
                </LinearLayout>
            </LinearLayout>

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="#1E293B"
                android:padding="12dp"
                android:layout_marginBottom="12dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="➕ নতুন ভাউচার ইমপোর্ট করুন (Bulk Import)"
                    android:textColor="#FFFFFF"
                    android:textSize="13sp"
                    android:textStyle="bold"
                    android:layout_marginBottom="6dp" />

                <EditText
                    android:id="@+id/etVoucherInput"
                    android:layout_width="match_parent"
                    android:layout_height="80dp"
                    android:hint="এখানে প্রতিটি ভাউচার কোড নতুন লাইনে পেস্ট করুন..."
                    android:textColorHint="#64748B"
                    android:textColor="#FFFFFF"
                    android:background="#0F172A"
                    android:padding="10dp"
                    android:gravity="top|left"
                    android:textSize="12sp" />

                <Button
                    android:id="@+id/btnImport"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="ভাউচার ইমপোর্ট করুন (Save Vouchers)"
                    android:background="#10B981"
                    android:textColor="#FFFFFF"
                    android:textStyle="bold" />
            </LinearLayout>

            <EditText
                android:id="@+id/etSearch"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="🔍 ভাউচার কোড বা কাস্টমার দিয়ে খুঁজুন..."
                android:textColorHint="#64748B"
                android:textColor="#FFFFFF"
                android:background="#1E293B"
                android:padding="12dp"
                android:textSize="12sp"
                android:layout_marginBottom="12dp" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="📋 ভাউচার তালিকা (Voucher List)"
                android:textColor="#E2E8F0"
                android:textSize="14sp"
                android:textStyle="bold"
                android:layout_marginBottom="6dp" />

            <ListView
                android:id="@+id/lvVouchers"
                android:layout_width="match_parent"
                android:layout_height="350dp"
                android:divider="#334155"
                android:dividerHeight="1dp" />

        </LinearLayout>
    </ScrollView>
</LinearLayout>`);

// 12. item_voucher.xml
fs.writeFileSync(path.join(baseDir, 'app/src/main/res/layout/item_voucher.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:background="#1E293B"
    android:padding="12dp"
    android:layout_marginBottom="8dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/tvCode"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="VOUCHER-1234"
            android:textColor="#FFFFFF"
            android:textSize="15sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="AVAILABLE"
            android:textColor="#34D399"
            android:textSize="11sp"
            android:textStyle="bold"
            android:padding="4dp" />
    </LinearLayout>

    <TextView
        android:id="@+id/tvDetails"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="1GB Daily • ৳30 • 1 Day Validity"
        android:textColor="#94A3B8"
        android:textSize="12sp"
        android:layout_marginTop="4dp" />
</LinearLayout>`);

// 13. strings.xml
fs.writeFileSync(path.join(baseDir, 'app/src/main/res/values/strings.xml'), `<resources>
    <string name="app_name">ROZOB WiFi Voucher Manager</string>
    <string name="hello_world">ROZOB WiFi Voucher Manager</string>
    <string name="dashboard">ড্যাশবোর্ড (Dashboard)</string>
</resources>`);

async function addFolderToZip(zip, folderPath, zipFolder) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const fullPath = path.join(folderPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            const newZipFolder = zipFolder.folder(file);
            await addFolderToZip(zip, fullPath, newZipFolder);
        } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(file, content);
        }
    }
}

async function createZip() {
    const zip = new JSZip();
    const rootFolder = zip.folder('ROZOB_WiFi_Voucher_Manager');
    await addFolderToZip(zip, baseDir, rootFolder);

    fs.mkdirSync('./public', { recursive: true });
    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync('./public/rozob_wifi_aide_project.zip', content);
    console.log('ZIP created successfully at ./public/rozob_wifi_aide_project.zip');
}

createZip().catch(err => console.error(err));
